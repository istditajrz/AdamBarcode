'use server'
import { search_tag, get_swappable, swap_asset_in_project, set_assignment_status, type Asset } from "@/common/api.mts";
import { InstanceConstsContext } from "@/app/InstanceConstsProvider";
import { type HandleTagProps, type Success } from "../TagInput";
import { checkLengthEq } from "../assets";
import { useContext } from "react";
import { server_unwrap } from "@/common/helpers.mts";


export async function handleTag(
    { project_id, assetTypes, setAssetTypes }: HandleTagProps,
    value: string
): Promise<Success> {
    'use server'
    const instanceConsts = useContext(InstanceConstsContext);
    const asset = server_unwrap(await search_tag(value));

    const assetTypeIndex = assetTypes.findIndex(
        v => v.id == asset.assetTypes_id && checkLengthEq(v, asset)
    );

    if (assetTypeIndex == -1) {
        return {
            res: false,
            error: "Asset Type not present"
        }
    }

    const assetType = assetTypes[assetTypeIndex]!;
    const assetIndex = assetType.assets.findIndex(a => a.assets_id == asset.assets_id);

    if (assetIndex == -1) {
        return {
            res: false,
            error: "Asset not present"
        }
    }

    await set_assignment_status(
        project_id,
        instanceConsts.assignmentStatuses.deprepped,
        asset.assets_tag
    );

    const new_assetTypes = assetTypes;
    new_assetTypes[assetTypeIndex]!.assets = Array(
        ...assetType.assets.slice(0, assetIndex),
        ...assetType.assets.slice(assetIndex + 1)
    );
    setAssetTypes(new_assetTypes)

    return { res: true };
}