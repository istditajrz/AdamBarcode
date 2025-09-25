import { prep_add } from "./add/add.mjs";
import { prep_remove } from "./remove/remove.mjs";
import { prep_swap } from "./swap/swap.mjs";
import { prep_set } from "./set/set.mjs";
const select = document.getElementById('select')!;
const set: Array<HTMLInputElement> = Array(...select.children).map((ul) => ul.firstChild) as any;
const boards: HTMLCollectionOf<HTMLDivElement> = document.querySelectorAll('.advanced .board') as any;

export function select_handler() {
    for (let i = 0; i < set.length; i++) {
        const el = set[i]!;
        const board = boards[i]!;
        if (el.checked) {
            board.classList.remove('invisible');
            Array(...board.getElementsByTagName('input'))
                .forEach(e => e.disabled = false);
            board.getElementsByTagName('input')[0]!
                .focus(); // Focus input box w/ cursor
        } else {
            board.classList.add('invisible');
            Array(...board.getElementsByTagName('input'))
                .forEach(e => e.disabled = true);
        }
    }
}
export async function prep_advanced(project_id: string | number) {
    select.onchange = select_handler;
    await Promise.all([
        prep_add(project_id),
        prep_remove(project_id),
        prep_swap(project_id),
        prep_set(project_id)
    ]);
}

export async function start_advanced() {
    select_handler();
}