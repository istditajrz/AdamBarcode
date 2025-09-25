import { defineConfig } from "vite";
import { dirname, resolve, parse } from 'node:path';
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const host = process.env.TAURI_DEV_HOST;
const __dirname = dirname(fileURLToPath(import.meta.url));
function html_parse(html, ctx) {
    const dir = "." + dirname(ctx.path);
    return html.replace(/<INJECT src="(.+)">/g,
        (s, p1) => {
            let path = undefined;
            if (!!ctx.recurse) {
                path = resolve(ctx.path, p1);
            } else {
                path = resolve(__dirname, dir, p1);
            }
            const f = String(readFileSync(path));
            const recurse_path = resolve(__dirname, dir, p1.split('/').at(-2));
            const t = html_parse(f, {path: recurse_path, recurse: true})
            return `<!-- ${p1} --> ${t} <!-- End ${p1} -->`;
        }
    );
};

const html_inject = {
    name: "inject_html",
    transformIndexHtml: {
        order: 'pre',
        handler: html_parse
    }
};

export default defineConfig({
    clearScreen: false,
    server: {
        port: 5173,
        strictPort: true,
        host: host || false,
        hmr: host ? {
            protocol: 'ws',
            host,
            port: 1421
        } : undefined,
        watch: {
            ignored: ['**/src-tauri/**']
        },
    },
    envPrefix: ['VITE_', 'TAURI_ENV_*'],
    build: {
        target: process.env.TAURI_ENV_PLATFORM == 'windows'
            ? 'chrome105'
            : 'safari113',
        minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
        sourcemap: !!process.env.TAURI_ENV_DEBUG,
    },
    appType: "mpa",
    plugins: [html_inject],
    optimizeDeps: {
        include: ["./common/api.mts", "./common/error.mts"]
    }
})