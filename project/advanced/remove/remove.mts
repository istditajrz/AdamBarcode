import { remove_asset_from_project, search_tag } from "/common/api.mts";

export async function prep_remove(project_id: number | string) {
    const tag: HTMLInputElement = document.getElementById('remove_tag')! as any;
    tag.onkeydown = async (e) => {
        if (e.key == 'Enter') {
            const asset = await search_tag(tag.value);
            await remove_asset_from_project(project_id, asset.assets_id);
            tag.value = '';
        }
    };
}