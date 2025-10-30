"use server";
import {
	search_tag,
	get_swappable,
	swap_asset_in_project,
	set_assignment_status,
} from "@/common/api.mts";
import { type HandleTagProps, type Success } from "../TagInput";
import { checkLengthEq } from "../assets";
import { server_unwrap } from "@/common/helpers.mts";
import { instanceConsts } from "@/common/consts.mts";

export async function handleTag(
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
			...assetTypes.slice(assetTypeIndex + 1),
		];
		return {
			res: false,
			assetTypes: new_assetTypes,
			error: "Asset Type not present",
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
	await Promise.all([
		swap_asset_in_project(
			assetType.assets[-1]!.assetsAssignments_id!,
			asset.assetTypes_id,
		),
		set_assignment_status(
			project_id,
			instanceConsts.assignmentStatuses.prepped,
			asset.assets_tag,
		),
	]);

	const new_assetTypes = assetTypes;
	// Remove [-1] from list
	new_assetTypes[assetTypeIndex]!.assets = assetType.assets.slice(0, -1);

	return { res: true, assetTypes: new_assetTypes };
}
