import { get_projects, get_project_data, type Project, prep_proj_statuses } from "/common/api.mts";

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
const tbody: HTMLTableElement = document.querySelector('.body')! as any;

const projects = window.sessionStorage.getItem('projects');
if (projects) {
    const list: Array<Project> = JSON.parse(projects);
    setTimeout(() => list!.forEach((element) => tbody.appendChild(row(element))));
}

get_projects()
    .then(async result => {
        const pdata = await Promise.all(result.map(p => get_project_data(p.projects_id)));
        const filtered = pdata.filter(v => prep_proj_statuses.includes(v.projectsStatuses_id)).sort((a, b) => Date.parse(a.project_dates_deliver_start) - Date.parse(b.project_dates_deliver_start));
        tbody.replaceChildren(
            ...filtered.map(row)
        );
        window.sessionStorage.setItem('projects', JSON.stringify(filtered));
    });
