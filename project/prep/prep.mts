import { get_project_assets, type InstanceAssets, type Asset, asset_assignments, search_tag, remove_asset_from_project, assign_asset_to_project, set_assignment_status } from "/common/api.mts";

type asset_type = {
    id: number,
    name: string,
    assets: Asset[],
    definableFields: Record<string, string>
};
const url = new URL(window.location.href);
const project_id = url.searchParams.get("p")!;

const field = (i: number) => "asset_definableFields_" + (i + 1);

const definableFields = (r: any) => (
    Object.fromEntries(
        r.assetTypes_definableFields_ARRAY
            .map((v: string, i: number) => {
                if (v == 'Fuse (A)') {
                    return [v, ""];
                }
                return [v, r[field(i)]];
            })
    )
);

const dedup_types = (requested: Asset[]): asset_type[] => {
    let types: Record<number, asset_type> = {};
    for (const r of requested) {
        const permissive_r = r as any;
        if (!Object.hasOwn(types, r.assetTypes_id)) {
            types[r.assetTypes_id] = {
                id: r.assetTypes_id,
                name: r.assetTypes_name,
                assets: [r],
                definableFields: definableFields(r)
            };
        } else if (
            Object.entries(
                types[r.assetTypes_id]!.definableFields
            ).every(([k, v]: string[], i: number) => v == permissive_r[field(i)])
        ) {
            types[r.assetTypes_id]!.assets.push(r);
        } else {
            types[r.assetTypes_id] = {
                id: r.assetTypes_id,
                name: r.assetTypes_name,
                assets: [r],
                definableFields: definableFields(r)
            }
        }
    }
    return Object.values(types);
}

const tag: HTMLInputElement = document.getElementById('prep_tag')! as any;

let requested: asset_type[] = [];

const tag_handle = async () => {
    const asset = await search_tag(tag.value);
    const oldIndex = requested.findIndex(
        (v) => (
            v.id == asset.assetTypes_id 
            && Object.is(v.definableFields, definableFields(asset))
        )
    );
    const old = requested[oldIndex];
    if (!!old) {
        await assign_asset_to_project(project_id, asset.assets_id);
        await remove_asset_from_project(project_id, old.id);
        await set_assignment_status(project_id, asset_assignments.prepped, asset.assets_tag);
        old.assets[];
        tag.style = "border: 4px var(--green);"
        setTimeout(() => tag.style = '', 100);
        tag.value = '';
    } else {
        tag.style = "border: 4px var(--red);"
        setTimeout(() => tag.style = '', 100);
        tag.value = '';
    }
}

tag.onkeydown = async (e) => {
    if (e.key == 'Enter') {
        await tag_handle();
    }
}

const row = (asset: asset_type) => {
    const el = document.createElement('template');
    const inner = `<tr class="asset-type" id=${asset.id}>`
                    + `<td class="item quantity">${asset.assets.length}`;
};

export async function start_prep(project_id: number | string) {
    const assets: InstanceAssets = (await get_project_assets(project_id))[import.meta.env.INSTANCE]!;
    requested = dedup_types(assets[asset_assignments.requested]!.assets);

}