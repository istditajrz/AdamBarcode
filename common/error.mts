let n_error = 0;

function error_banner(msg: string, url: string | undefined, line: number, col: number, error: Error | undefined) {
    const el = document.createElement('template');
    let e = error || {name: ""};
    let path: string;
    if (url) { 
        path = new URL(url).pathname;
    } else {
        path="";
    }
    el.innerHTML = 
        `<div id="${n_error.toString()}" class="error">
            <span class="error_text">${e.name}: ${msg}</span>
            <span class="error_loc">At ${path}: ${line.toString()};${col.toString()}</span>
        </div>`;
    n_error += 1;
    const inner = el.content.firstChild;
    document.getElementById('error_list')!
        .appendChild(inner!);
    setTimeout(() => { inner!.remove() }, 30 * 1000);
};
window.onerror = (msg, url, line, col, error) => {
    error_banner(msg.toString(), url, line || 0, col || 0, error);
    return true;
}