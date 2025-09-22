import { get_projects, type Project } from "../api.mjs";

let count = 100;
const observe = () => {
    count -= 1;
    if (!count) {
        return;
    }
    try {
        const twenty48 = document.getElementById('2048')!;
        const container = document.querySelector('#tablebody')!;
        console.log(
            container.getBoundingClientRect().width,
            twenty48.querySelector('.id')?.getBoundingClientRect().width,
            twenty48.querySelector('.project')?.getBoundingClientRect().width,
            twenty48.querySelector('.client')?.getBoundingClientRect().width
        );
    } catch (e) {
        console.log(e);
    }
    setTimeout(observe, 50)
};
// observe();
const row = (p: Project) => {
    const el = document.createElement('template');
    el.innerHTML = '<tr id="' + p.projects_id.toString() + '">\n'
                    + '<td class="id">' + p.projects_id.toString() + '</td>\n'
                    + '<td class="project">' + p.projects_name + '</td>\n'
                    + '<td class="client">' + (p.clients_name || "None") + '</td>\n'
                    + '</tr>';
    const inner: HTMLTableRowElement = el.content.firstChild! as any;
    inner.onclick = () => window.location.href = "/project/?p=" + p.projects_id.toString() + "&name=" + p.projects_name;
    return inner;
};
const tbody: HTMLTableElement = document.getElementById('tablebody')! as any;

const projects = window.sessionStorage.getItem('projects');
if (projects) {
    const list: Array<Project> = JSON.parse(projects);
    setTimeout(() => list!.forEach((element) => tbody.appendChild(row(element))));
}

get_projects()
    .then((result) => {
        tbody.replaceChildren(
            ...result.map(element => row(element))
        );
        window.sessionStorage.setItem('projects', JSON.stringify(result));
    });
