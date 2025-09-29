import {
    remove_asset_from_project, get_project_assets,
    search_tag, set_assignment_status, assign_asset_to_project,
    type Asset, type InstanceAssets
} from "/common/api.mts";

let recent_ids: number[] = [];
async function handle_swap(project_id: number | string, e_replacement: HTMLInputElement, status: HTMLSelectElement) {
    e_replacement.onkeydown = async (e) => {
        if (e.key == 'Enter') {
            const assets: InstanceAssets = (await get_project_assets(project_id))[import.meta.env.INSTANCE]!;
            const project_assets: Asset[] = Object.entries(assets)
                .flatMap(([k, s]) => s.assets)
            const replacement = await search_tag(e_replacement.value);
            const original = project_assets.find((v) => !recent_ids.includes(v.assets_id) && v.assetTypes_id == replacement?.assetTypes_id)
            if (!original) {
                throw new Error("No item to replace!");
            }
            await remove_asset_from_project(project_id, original.assets_id);
            await assign_asset_to_project(project_id, replacement.assets_id);
            await set_assignment_status(project_id, status.value, replacement.assets_tag);
            e_replacement.value = '';
            recent_ids.push(replacement.assets_id);
        }
    }
}

export async function prep_swap(project_id: number | string) {
    const replacement = document.getElementById('swap_tag')! as any;
    const status = document.getElementById('swap_status')! as any;
    await handle_swap(project_id, replacement, status);
}