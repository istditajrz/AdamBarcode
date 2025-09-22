import { defineConfig } from "vite";
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const host = process.env.TAURI_DEV_HOST;
const __dirname = dirname(fileURLToPath(import.meta.url));

const html_inject = {
    name: "inject_html",
    transformIndexHtml: {
        order: 'pre',
        handler: (html) => (
            html.replace(/<INJECT src="(.+)">/g,
                (s, p1) => `<!-- ${p1} --> ${readFileSync(resolve(__dirname, p1))} <!-- End ${p1} -->`
            )
        )
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
    plugins: [html_inject]
})