'use server'

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
export type RespHelp<T> = {
	result: boolean;
	response?: T;
	error?: any;
};

export class AuthError extends Error {
	constructor() {
		super("AUTH_FAIL");
		this.name = "AuthError";
	}
}

// METHODS
async function endpoint<T>(
	method: "GET" | "POST",
	path: string,
	body?: any,
): Promise<T> {
	return fetch(`/api${path}`, {
		method: method,
		credentials: "include",
		body: JSON.stringify(body) || null,
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			return res.json() as Promise<RespHelp<T>>;
		})
		.then((inner) => {
			if (!inner.result) {
				throw new Error(JSON.stringify(inner.error));
			}
			return inner.response!;
		});
}

async function get_endpoint<T>(path: string, body?: any): Promise<T> {
	return await endpoint("GET", path, body);
}

async function post_endpoint<T>(path: string, body?: any): Promise<T> {
	return await endpoint("POST", path, body);
}

export async function get_projects(): Promise<Project[]> {
	return get_endpoint("/get_projects");
}

export async function get_project_assets<T = Record<string, InstanceAssets>>(
	project_id: number | string
): Promise<InstanceAssets> {
	return get_endpoint(`/assets?projects_id=${project_id}`);
}

export async function assign_asset_to_project(
	project_id: string | number,
	asset_id: number,
) {
	return await post_endpoint<any>("/assign", {
		projects_id: +project_id,
		assets_id: asset_id,
	});
}

export async function remove_asset_from_project(
	project_id: number | string,
	asset_id: number,
) {
	await post_endpoint<any>("/remove", {
		projects_id: +project_id,
		assets_id: asset_id,
	});
}

export async function search_tag(tag: string): Promise<Asset> {
	const url = `/search?term=${tag}`;
	return get_endpoint<Asset[]>(url).then((res) => {
		const asset = res[0];
		if (!asset) {
			throw new Error("No asset found!");
		} else {
			return asset;
		}
	});
}

export async function swap_asset_in_project(
	assetsAssignments_id: number,
	assets_id: number,
) {
	await post_endpoint<any>("/swap", {
		assetsAssignments_id: assetsAssignments_id,
		assets_id: assets_id,
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
	return post_endpoint<any>("/status?" + params.toString());
}

export async function get_project_data(
	project_id: number | string,
): Promise<ProjectData> {
	return post_endpoint<{ project: ProjectData }>(
		"/project?id=" + project_id.toString(),
	).then((v) => v.project);
}

export async function get_swappable(
	assetsAssignments_id: number
): Promise<{
	assets_id: number,
	assets_tag: string,
	assets_definable_field_1?: string
}[]> {
	return post_endpoint('/assets/substitutions.php', { assetsAssignments_id: assetsAssignments_id });
}