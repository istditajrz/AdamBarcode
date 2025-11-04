import { type NextConfig } from "next";
// import { ZBAR_WASM_REPOSITORY } from '@undecaf/barcode-detector-polyfill';

const conf: NextConfig = {
    // turbopack: {
    //     rules: {
    //         '*': {
    //             loaders: [{
    //                 loader: 'string-replace-loader',
    //                 options: {
    //                     search: ZBAR_WASM_REPOSITORY,
    //                     replace: '@undecaf/zbar-wasm',
    //                     flags: 'g'
    //                 }
    //             }],
    //         }
    //     }
    // }
};
export default conf;
