import {fetch} from "@tauri-apps/plugin-http"

// TYPES

export type Project  = {
	projects_name: string,
	projects_id: number,
	clients_name: string,
}

export type Asset = {
	assets_id: number,
	assetsAssignments_id?: number
	assetTypes_name: string,
	assetTypes_id: number,
	manufacturers_name: string,
	assets_tag: string,
	flagsblocks?: {
		COUNT: {
			BLOCK: number,
			FLAG: number
		}
	}
}
export type StatusAssets = {
	assetsAssignmentsStatus_id: number,
	assets: Asset[],
}

export type InstanceAssets = {
	[status: number]: StatusAssets
}

// CONSTS

export const BASE_URL: string = "https://dash.adam-rms.com/api"

export const registered_instance: Record<number, string> = {
	1: "Technical Theatre Society",
	26: "Derwent College Assets",
	28: "James Kendrick Assets"
};

export function instances(id: number): string {
	return registered_instance[id] || `Unkown Instance: ${id}`;
}

export const registered_assignment_status: Record<number, string> = {
	1: "Requested",
	2: "Prepped",
	3: "Dispatched",
	5: "Returned & Stored"
}

export function assignment_status(id: number): string {
	return registered_assignment_status[id] || `Unknown Status: ${id}`;
}

// Response helper
export type RespHelp<T> = {
	result: boolean,
	response?: T,
	error?: any
}

export class AuthError extends Error {
	constructor () {
		super("AUTH_FAIL");
		this.name = "AuthError"
	}
}

// METHODS
async function endpoint<T>(method: "GET" | "POST", path: string, body?: any): Promise<T> {
	return fetch(`${BASE_URL}${path}`, {
		method: method,
		credentials: "include",
		body: JSON.stringify(body) || null
	}).then((res) => {
		if (!res.ok) { 
			console.log("404?");
			throw new Error(res.statusText); 
		}
		return res.json() as Promise<RespHelp<T>>;
	}).then((inner) => {
		if (!inner.result) {
			throw new Error(JSON.stringify(inner.error));
		}
		return inner.response as any as T;
	});
}

async function endpoint_plus_auth<T>(method: "GET" | "POST", path: string, body?: any): Promise<T> {
	await authenticate();
	return endpoint(method, path, body);
}

async function get_endpoint<T>(path: string, body?: any): Promise<T> {
	return await endpoint_plus_auth("GET", path, body); 
}

async function post_endpoint<T>(path: string, body?: any): Promise<T> {
	return await endpoint_plus_auth("POST", path, body); 
}

export async function authenticate() {
	const env = import.meta.env;
	const auth = {formInput: env.VITE_USR, password: env.VITE_PASS};
	await endpoint<any>("POST", "/login/login.php", auth);
}

export async function get_projects(): Promise<Project[]> {
	return get_endpoint("/projects/list.php");
}

export async function get_project_assets<T = {[instance: number]: InstanceAssets}>(project_id: number | string): Promise<T> {
	return get_endpoint<T>(`/projects/assets/statusList.php?projects_id=${project_id}`);
}

export async function assign_asset_to_project(project_id: string | number, asset_id: number) {
	return await post_endpoint<any>(
		"/projects/assets/assign.php",
		{ projects_id: +project_id, assets_id: asset_id }
	);
}

export async function remove_asset_from_project(project_id: number | string, asset_id: number) {
	await post_endpoint<any>(
		"/projects/assets/unassign.php",
		{ projects_id: +project_id, assets_id: asset_id }
	);
}

export async function search_tag(tag: string): Promise<Asset> {
	const url = `/assets/searchAssets.php?term=${tag}`;
	return get_endpoint<Asset[]>(url)
		.then((res) => {
			const asset = res[0];
			if (!asset) {
				throw new Error("No asset found!");
			} else {
				return asset;
			}
		});
}

export async function swap_asset_in_project(assetsAssignments_id: number, assets_id: number) {
	await post_endpoint<any>(
		"/projects/assets/swap.php",
		{ assetsAssignments_id: assetsAssignments_id, assets_id: assets_id }
	);
}

export async function set_assignment_status(project_id: number | string, assignment_status: number | string, asset_tag: string) {
	const params = new URLSearchParams({
			projects_id: project_id.toString(),
			assetsAssignments_status: assignment_status.toString(),
			text: asset_tag.toString()
		});
	return await post_endpoint<any>(
		"/projects/assets/setStatusByTag.php?" + params.toString()
	);
}
