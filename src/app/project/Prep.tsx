'use client'

import { type Asset, assign_asset_to_project, get_project_assets, get_swappable, type InstanceAssets, remove_asset_from_project, search_tag, set_assignment_status, swap_asset_in_project } from "@/common/api.mts";
import { Table, TextInput } from "@mantine/core";
import { useInstanceConsts } from "@/app/InstanceConstsProvider";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faHashtag } from "@fortawesome/free-solid-svg-icons";
import { instanceConsts } from "@/common/consts.mjs";

type AssetType = {
    id: number;
    name: string;
    assets: Asset[];
    length?: string;
}

const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
const [success, setSuccess] = useState<boolean>();

const checkLengthEq = (a: AssetType, b: Asset) => (a.length || "") == b.asset_definableFields_1;

function dedupTypes(requested: Asset[]): AssetType[] {
    let types: Record<number, AssetType> = {};
    for (const r of requested) {
        let length = undefined;
        if (Object.hasOwn(types, r.assetTypes_id) && checkLengthEq(types[r.assetTypes_id]!, r)) {
            types[r.assetTypes_id]!.assets.push(r);
        } else {
            types[r.assetTypes_id] = {
                id: r.assetTypes_id,
                name: r.assetTypes_name,
                assets: [r],
            };
            if (r.assetTypes_definableFields_ARRAY[0] == 'Length (m)') {
                types[r.assetTypes_id]!.length = r.asset_definableFields_1;
            }
        }
    }
    return Object.values(types);
}

function ListAssets({ asset_list }: { asset_list: AssetType[] }) {
    const row = (asset_type: AssetType) => (
        <Table.Tr>
            <Table.Td>{asset_type.assets.length}</Table.Td>
            <Table.Td>{asset_type.name}</Table.Td>
            <Table.Td>{asset_type.length || ""}</Table.Td>
        </Table.Tr>
    );
    return <Table stickyHeader stickyHeaderOffset={60} id="prep_list">
        <Table.Thead>
            <Table.Tr>
                <Table.Th>Quantity</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Length</Table.Th>
            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
            {asset_list.map(row)}
        </Table.Tbody>
    </Table>;
}

async function handleTag(project_id: string | number, value: string): Promise<boolean> {
    const asset = await search_tag(value);

    const assetTypeIndex = assetTypes.findIndex(v => v.id == asset.assetTypes_id && checkLengthEq(v, asset));
    if (assetTypeIndex == -1) {
        return false;
    }
    const assetType = assetTypes[assetTypeIndex]!;
    if (assetType.assets.length < 1) {
        setAssetTypes(Array(...assetTypes.slice(0, assetTypeIndex), ...assetTypes.slice(assetTypeIndex + 1)));
        return false;
    }

    const canSwap = await get_swappable(assetType.assets[0]!.assetsAssignments_id!);
    if (canSwap.findIndex(a => a.assets_id == asset.assets_id) == -1) {
        return false;
    }
    await Promise.all([
        swap_asset_in_project(assetType.assets.pop()!.assetsAssignments_id!, asset.assetTypes_id),
        set_assignment_status(project_id, instanceConsts.assignmentStatuses.prepped, asset.assets_tag)
    ]);
    // fire effect of .pop() above ^
    setAssetTypes(assetTypes);
    return true;
}

function TagInput({ project_id }: { project_id: string | number }) {
    const tag = useRef<HTMLInputElement>(null);
    tag.current!.onkeydown = async (e) => {
        if (e.key == 'Enter') {
            const res = await handleTag(project_id, tag.current!.value);
            if (!res) {
                setSuccess(res);
                setTimeout(() => setSuccess(true), 500);
            }
        }
    }
    return (
        <TextInput ref={tag} label="Tag:" aria-label="Tag Input" placeholder="A-1234" leftSection={<FontAwesomeIcon icon={success ? faHashtag : faCircleExclamation} />} />
    );
}

export async function Prep({ project_id }: { project_id: string | number }) {
    const instance_consts = useInstanceConsts();
    const proj_assets: InstanceAssets = (await get_project_assets(project_id))[instance_consts.instance]!;
    const to_prep_assets = proj_assets[instance_consts.assignmentStatuses.prep];
    const dedup = dedupTypes(to_prep_assets!.assets);
    setAssetTypes(dedup);
    return <>
        <ListAssets asset_list={assetTypes} />
    </>;
}