import { search_tag, set_assignment_status } from "../api.mjs";

export async function prep_set(project_id: string | number) {
    const tag: HTMLInputElement = document.getElementById('set_tag')! as any;
    const status: HTMLInputElement = document.getElementById('set_status')! as any;
    tag.onkeydown = async (e) => {
        if (e.key == 'Enter') {
            const asset = await search_tag(tag.value);
            await set_assignment_status(project_id, status.value, asset.assets_tag);
            tag.value = '';
        }
    };
}
