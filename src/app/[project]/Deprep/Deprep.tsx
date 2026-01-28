"use client";

import { use, useContext, useEffect, useState } from "react";
import { type AssetType, dedupTypes } from "../assets";
import { ListAssets } from "../ListAssets";
import { TagInput } from "../TagInput/TagInput";

import { handleTag } from "./handleTag";
import { InstanceConstsContext } from "@/app/InstanceConstsProvider";
import { type InstanceAssets } from "@/common/api.mts";

export function Deprep({
	project_id,
	proj_assets,
}: {
	project_id: string | number;
	proj_assets: InstanceAssets;
}) {
	const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
	const instance_consts = useContext(InstanceConstsContext);

	useEffect(() => {
		const to_prep_assets = Object.values(proj_assets).find(
			(v) =>
				v.assetsAssignmentsStatus_id ==
				instance_consts.assignmentStatuses.deprep,
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
				handleTag={(p, v) => {
					localStorage.setItem('page', 'deprep');
					return handleTag(p, v);
				}}
				className="w-[90%] m-auto pt-3 pb-3"
			/>
			<ListAssets asset_list={assetTypes} className="w-[90%]! m-auto" />
		</>
	);
}
