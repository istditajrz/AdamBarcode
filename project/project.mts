import { get_projects } from "/common/api.mts";
import { prep_advanced, start_advanced } from "./advanced/advanced.mjs"; 
import { start_prep } from "./prep/prep.mjs";
import { start_deprep } from "./deprep/deprep.mjs";

const url = new URL(window.location.href);
const project_id = url.searchParams.get("p")!;
const proj_name = url.searchParams.get("name");

const title = document.getElementById('title')!;
const simple_select = document.getElementById('simple-select')!;
const prep_options = simple_select.getElementsByTagName('input');
const boards = document.querySelectorAll('.body .board');

async function simple_select_handler() {
    for (let i = 0; i < prep_options.length; i++) {
        const option = prep_options[i]!;
        const board = boards[i]!;
        if (option.checked) {
            option.classList.remove('invisble');
            board.classList.remove('invisible')
            Array(...board.getElementsByTagName('input'))
                .reverse()
                .forEach(v => {
                    v.disabled = false;
                    v.focus()
                });
            switch (option.value) {
                case 'advance':
                    setTimeout(start_advanced);
                    break;
                default:
                case 'prep':
                    await start_prep(project_id);
                    break;
                case 'deprep':
                    await start_deprep(project_id);
                    break;
            }
        } else {
            Array(...board.getElementsByTagName('input')).forEach(v => v.disabled = true);
            board.classList.add('invisible');
        }
    }
}

simple_select.onchange = simple_select_handler;

(async function main() {
    simple_select_handler();
    if (proj_name) {
        title.innerText = proj_name
    } else {
        const project = await get_projects()
            .then((result) => result.find(
                (project) => project.projects_id.toString() == project_id
            ));
        title.innerText = project?.projects_name || "Unknown Project";
    }
    await prep_advanced(project_id);
})();