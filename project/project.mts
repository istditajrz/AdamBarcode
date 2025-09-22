import { authenticate, get_projects } from "../api.mjs";
import { prep_add } from "../add/add.mjs";
import { prep_remove } from "../remove/remove.mjs";
import { prep_swap } from "../swap/swap.mjs";
import { prep_set } from "../set/set.mjs";

const select = document.getElementById('select')!;
const set: Array<HTMLInputElement> = Array(...select.children).map((ul) => ul.firstChild) as any;
const boards: HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName('board') as any;

function select_handler() {
    for (let i = 0; i < set.length; i++) {
        const el = set[i]!;
        const board = boards[i]!;
        if (el.checked) {
            board.classList.remove('invisible');
            Array(...board.getElementsByClassName('input'))
                .forEach(e => e.removeAttribute('disabled'));
            board.getElementsByTagName('input')[0]!
                .focus(); // Focus input box w/ cursor
        } else {
            board.classList.add('invisible');
            Array(...board.getElementsByClassName('input'))
                .forEach(e => {
                    if (!e.hasAttribute('disabled')) {
                        e.toggleAttribute('disabled')
                    }
                });
        }
    }
}

select_handler();
select.onchange = select_handler;

const title = document.getElementById('title')!;

(async function main() {
    const url = new URL(window.location.href);
    const project_id = url.searchParams.get("p")!;
    const proj_name = url.searchParams.get("name");
    await Promise.all([
        prep_add(project_id),
        prep_remove(project_id),
        prep_swap(project_id),
        prep_set(project_id)
    ]);
    if (proj_name) {
        title.innerText = proj_name
    } else {
        const project = await get_projects()
            .then((result) => result.find(
                (project) => project.projects_id.toString() == project_id
            ));
        title.innerText = project?.projects_name || "Unknown Project";
    }
})();