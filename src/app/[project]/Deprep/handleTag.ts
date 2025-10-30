"use server";
import {
	search_tag,
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
	const assetIndex = assetType.assets.findIndex(
		(a) => a.assets_id == asset.assets_id,
	);

	if (assetIndex == -1) {
		return {
			res: false,
			assetTypes: null,
			error: "Asset not present",
		};
	}

	await set_assignment_status(
		project_id,
		instanceConsts.assignmentStatuses.deprepped,
		asset.assets_tag,
	);

	const new_assetTypes = assetTypes;
	if (new_assetTypes[assetTypeIndex]?.assets.length == 1) {
		delete new_assetTypes[assetTypeIndex]
	} else {
		new_assetTypes[assetTypeIndex]!.assets = [
			...assetType.assets.slice(0, assetIndex),
			...assetType.assets.slice(assetIndex + 1),
		];
	}


	return { res: true, assetTypes: new_assetTypes };
}