"use client";

import { InstanceConstsContext } from "@/app/InstanceConstsProvider";
import { use, useContext, useEffect, useState } from "react";
import { type AssetType, dedupTypes } from "../assets";
import { ListAssets } from "../ListAssets";
import { TagInput } from "../TagInput";
import { handleTag } from "./handleTag";

import { ProjectAssetsContext } from "../ProjectAssetsProvider";

export function Prep({
	project_id,
}: {
	project_id: string | number;
}) {
	const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
	const proj_assets = useContext(ProjectAssetsContext);

	const instance_consts = useContext(InstanceConstsContext);
	// Avoid infinite loop
	useEffect(() => {
		const to_prep_assets = Object.values(proj_assets).find(
			(v) =>
				v.assetsAssignmentsStatus_id ==
				instance_consts.assignmentStatuses.prep,
		);
		const dedup = dedupTypes(to_prep_assets!.assets);
		setAssetTypes(dedup);
	}, [proj_assets, instance_consts]);

	return (
		<>
			<TagInput
				project_id={project_id}
				assetTypes={assetTypes}
				setAssetTypes={setAssetTypes}
				handleTag={handleTag}
				className="w-[90%] m-auto pt-3 pb-3"
			/>
			<ListAssets asset_list={assetTypes} className="w-[90%]! m-auto" />
		</>
	);
}