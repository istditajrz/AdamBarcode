"use server";
import { search_tag, set_assignment_status } from "@/common/api.mts";
import { type HandleTagProps, type Success } from "../TagInput/TagInput";
import { checkLengthEq } from "../assets";
import { server_unwrap } from "@/common/helpers.mts";
import { instanceConsts } from "@/common/consts.mts";

async function innerHandleTag(
	{ project_id, assetTypes }: HandleTagProps,
	value: string,
): Promise<Success> {
	"use server";
	const maybe_asset = await search_tag(value);
	if (!maybe_asset.result) {
		return {
			res: false,
			assetTypes: null,
			error: JSON.stringify(maybe_asset.error)
		}
	}
	const asset = maybe_asset.response!;
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

	let new_assetTypes = assetTypes;
	if (new_assetTypes[assetTypeIndex]?.assets.length == 1) {
		new_assetTypes = [
			...new_assetTypes.slice(0, assetTypeIndex),
			...new_assetTypes.slice(assetTypeIndex + 1, new_assetTypes.length)
		]
	} else {
		new_assetTypes[assetTypeIndex]!.assets = [
			...assetType.assets.slice(0, assetIndex),
			...assetType.assets.slice(assetIndex + 1, assetType.assets.length),
		];
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
		const new_tag = `${prefix}-${number.padStart(4, '0')}`;
		return handleTag(props, new_tag);
	}
	return t;
}