"use server";

import { Ok } from "./helpers.mts";

// TYPES
export type Project = {
	projects_name: string;
	projects_id: number;
	clients_name: string;
};

export type ProjectData = {
	projects_id: number;
	projects_name: string;
	clients_name: string;
	project_dates_deliver_start: string;
	projectsStatuses_id: number;
};

export type Asset = {
	assets_id: number;
	assetsAssignments_id?: number;
	assetTypes_name: string;
	assetTypes_id: number;
	manufacturers_name: string;
	assets_tag: string;
	flagsblocks?: {
		COUNT: {
			BLOCK: number;
			FLAG: number;
		};
	};
	assetTypes_definableFields_ARRAY: string[];
	asset_definableFields_1: string;
};
export type StatusAssets = {
	assetsAssignmentsStatus_id: number;
	assets: Asset[];
};

export type InstanceAssets = {
	[status: number]: StatusAssets;
};

// Response helper
export type Response<T> = {
	result: boolean;
	response?: T;
	error?: {
		code?: string;
		message?: string;
	};
};

export class AuthError extends Error {
	constructor() {
		super("AUTH_FAIL");
		this.name = "AuthError";
	}
}

let cookie: string | undefined;
const base = process.env.ADAMRMS_BASE_URL; // || "https://dash.adam-rms.com/api/";

// METHODS
async function endpoint<T>(
	method: "GET" | "POST",
	path: string,
	body?: Record<string, string>,
	auth?: boolean,
	_recursed?: boolean,
): Promise<Response<T>> {
	if (process.browser || typeof window !== "undefined") {
		throw new Error("THIS CANNOT BE A BROWSER");
	}

	const h = new Headers();

	// Make sure cookie set
	if (!cookie && !auth) {
		await authenticate();
	}
	h.append("Cookie", cookie!);
	return fetch(`${base}${path}`, {
		method: method,
		credentials: "include",
		headers: h,
		body: JSON.stringify(body) || null,
		cache: "force-cache",
		next: {
			revalidate: 5 * 60,
		},
	})
		.then((res) => {
			if (!res.ok) {
				return {
					result: false,
					error: {
						code: res.status.toString(),
						message: res.statusText,
					},
				};
			}
			if (auth) {
				cookie = res.headers.getSetCookie()[0];
			}
			return res.json() as Promise<Response<T>>;
		})
		.then(async (inner) => {
			if (!inner.result) {
				if (inner.error?.code == "AUTH FAIL" && !_recursed) {
					await authenticate();
					return endpoint(method, path, body, false, true);
				}
			}
			return inner;
		});
}

export async function authenticate(): Promise<void> {
	await endpoint(
		"POST",
		"/login/login.php",
		{ formInput: process.env.USR!, password: process.env.PASS! },
		true,
	);
}

async function get_endpoint<T>(
	path: string,
	body?: Record<string, string>,
): Promise<Response<T>> {
	return await endpoint("GET", path, body);
}

async function post_endpoint<T>(
	path: string,
	body?: Record<string, string>,
): Promise<Response<T>> {
	return await endpoint("POST", path, body);
}

export async function get_projects(): Promise<Response<Project[]>> {
	return await get_endpoint("/projects/list.php");
}

export async function get_project_assets<T = Record<string, InstanceAssets>>(
	project_id: number | string,
): Promise<Response<T>> {
	return await get_endpoint(
		`/projects/assets/statusList.php?projects_id=${project_id}`,
	);
}

export async function assign_asset_to_project(
	project_id: string | number,
	asset_id: number,
) {
	return await post_endpoint<void>("/projects/assets/assign.php", {
		projects_id: project_id.toString(),
		assets_id: asset_id.toString(),
	});
}

export async function remove_asset_from_project(
	project_id: number | string,
	asset_id: number,
) {
	await post_endpoint<void>("/projects/assets/unassign.php", {
		projects_id: project_id.toString(),
		assets_id: asset_id.toString(),
	});
}

export async function search_tag(tag: string): Promise<Response<Asset>> {
	const url = `/assets/searchAssets.php?term=${tag}`;
	return await get_endpoint<Asset[]>(url).then((res) => {
		if (!res.result) {
			// We know `response` is unfilled => this cast is okay
			return res as unknown as Response<Asset>;
		}
		const asset = res.response![0];
		if (!asset) {
			return {
				result: false,
				error: {
					message: "Asset not found",
				},
			};
		} else {
			return Ok(asset);
		}
	});
}

export async function swap_asset_in_project(
	assetsAssignments_id: number,
	assets_id: number,
) {
	return await post_endpoint("/projects/assets/swap.php", {
		assetsAssignments_id: assetsAssignments_id.toString(),
		assets_id: assets_id.toString(),
	});
}

export async function set_assignment_status(
	project_id: number | string,
	assignment_status: number | string,
	asset_tag: string,
) {
	const params = new URLSearchParams({
		projects_id: project_id.toString(),
		assetsAssignments_status: assignment_status.toString(),
		text: asset_tag.toString(),
	});
	return await post_endpoint<void>(
		"/projects/assets/setStatusByTag.php?" + params.toString(),
	);
}

export async function get_project_data(
	project_id: number | string,
): Promise<Response<ProjectData>> {
	if (!project_id) {
		return { result: false, error: { message: "huh?" } };
	}
	return await post_endpoint<{ project: ProjectData }>(
		"/projects/data.php?id=" + project_id.toString(),
	).then((v) =>
		!v.result
			? (v as unknown as Response<ProjectData>)
			: Ok(v.response!.project),
	);
}

export async function get_swappable(assetsAssignments_id: number): Promise<
	Response<
		{
			assets_id: number;
			assets_tag: string;
			assets_definable_field_1?: string;
		}[]
	>
> {
	return await post_endpoint("/assets/substitutions.php", {
		assetsAssignments_id: assetsAssignments_id.toString(),
	});
}
