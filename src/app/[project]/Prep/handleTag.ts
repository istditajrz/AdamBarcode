"use server";
import {
	search_tag,
	get_swappable,
	swap_asset_in_project,
	set_assignment_status,
} from "@/common/api.mts";
import { type HandleTagProps, type Success } from "../TagInput/TagInput";
import { checkLengthEq, type AssetType } from "../assets";
import { server_unwrap } from "@/common/helpers.mts";
import { instanceConsts } from "@/common/consts.mts";

async function innerHandleTag(
	{ project_id, assetTypes }: HandleTagProps,
	value: string,
): Promise<Success> {
	"use server";
	const asset = server_unwrap(await search_tag(value));

	const assetTypeIndex = assetTypes.findIndex(
		(v) => v.id == asset.assetTypes_id && checkLengthEq(v, asset),
	);
	if (assetTypeIndex == -1) {
		return {
			res: false,
			assetTypes: null,
			error: "Asset Type not present",
		};
	}
	const assetType = assetTypes[assetTypeIndex]!;
	if (assetType.assets.length < 1) {
		const new_assetTypes = [
			...assetTypes.slice(0, assetTypeIndex),
			...assetTypes.slice(assetTypeIndex + 1, assetTypes.length),
		];
		return {
			res: false,
			assetTypes: new_assetTypes,
			error: "Asset Type not present",
		};
	}
	const asset_index = assetType.assets.findIndex(
		(v) => v.assets_id === asset.assets_id,
	);
	if (asset_index !== -1) {
		server_unwrap(
			await set_assignment_status(
				project_id,
				instanceConsts.assignmentStatuses.prepped,
				asset.assets_tag,
			),
		);
		if (assetType.assets.length == 1) {
			const new_assetTypes: AssetType[] = [
				...assetTypes.slice(0, assetTypeIndex),
				...assetTypes.slice(assetTypeIndex + 1, assetTypes.length),
			];

			return {
				res: true,
				assetTypes: new_assetTypes,
			};
		}

		const new_assets = [
			...assetType.assets.slice(0, asset_index),
			...assetType.assets.slice(asset_index + 1, assetType.assets.length),
		];

		const new_assetType: AssetType = {
			name: assetType.name,
			id: assetType.id,
			assets: new_assets,
		};
		if (!!assetType.length) {
			new_assetType.length = assetType.length;
		}

		const new_assetTypes: AssetType[] = [
			...assetTypes.slice(0, assetTypeIndex),
			...assetTypes.slice(assetTypeIndex + 1, assetTypes.length),
			new_assetType,
		];
		return {
			res: true,
			assetTypes: new_assetTypes,
		};
	}

	const canSwap = await get_swappable(
		assetType.assets[0]!.assetsAssignments_id!,
	);
	if (
		server_unwrap(canSwap).findIndex(
			(a) => a.assets_id == asset.assets_id,
		) == -1
	) {
		return {
			res: false,
			assetTypes: null,
			error: "Asset values do not match",
		};
	}

	const new_assetTypes = assetTypes;
	// Remove [-1] from list
	new_assetTypes[assetTypeIndex]!.assets = assetType.assets.slice(0, -1);

	const operation = await Promise.all([
		swap_asset_in_project(
			assetType.assets.at(-1)!.assetsAssignments_id!,
			asset.assetTypes_id,
		),
		set_assignment_status(
			project_id,
			instanceConsts.assignmentStatuses.prepped,
			asset.assets_tag,
		),
	]);

	const res: boolean = operation
		.map((v) => v.result)
		.reduce((acc, v) => acc && v);

	if (!res) {
		return {
			res: false,
			assetTypes: null,
			error: "Asset not swappable",
		};
	}

	return { res: true, assetTypes: new_assetTypes };
}

export async function handleTag(props: HandleTagProps, value: string) {
	const test = /-[0-9]{4}$/;
	const t = await innerHandleTag(props, value);
	if (t.res) {
		return t;
	}
	if (!test.test(value)) {
		const pattern = /([0-9]+$)/;
		const number = pattern.exec(value)![0];
		const prefix = value.slice(0, value.length - number.length);
		return handleTag(props, `${prefix}-${number.padStart(4, '0')}`);
	}
	return t;
}