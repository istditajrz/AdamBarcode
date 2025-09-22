import { 
    assign_asset_to_project, search_tag, set_assignment_status
} from "../api.mjs";

export async function prep_add(project_id: string) {
        const tag: HTMLInputElement = document.getElementById('add_tag')! as any;
        const status: HTMLSelectElement = document.getElementById('add_status')! as any;
        tag.onkeydown = async (e) => {
            if (e.key == 'Enter') {
                const asset = await search_tag(tag.value);
                await assign_asset_to_project(project_id, asset.assets_id);
                await set_assignment_status(project_id, status.value, asset.assets_tag);
                tag.value = '';
            }
        };
    }