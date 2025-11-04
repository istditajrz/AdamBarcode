'use client'
import { BarcodeScanner } from 'react-barcode-scanner';
import { BarcodeDetectorPolyfill } from '@preflower/barcode-detector-polyfill';
import type { ComponentProps, Success } from './TagInput';
import { client_unwrap } from '@/common/helpers.mts';
import dynamic from 'next/dynamic';

function BarcodeComponent(props: ComponentProps) {
    if (typeof window === 'undefined') {
        throw Error('THIS CANNOT BE A SERVER COMPONENT');
    }

    try {
        (window as any).BarcodeDetector?.getSupportedFormats()
    } catch {
        (window as any).BarcodeDetector = BarcodeDetectorPolyfill;
    }

    function onFinish(res: Success) {
        if (!res.res) {
            client_unwrap({ result: false, error: { message: res.error || "" } })
        }
        if (!!res.assetTypes) {
            props.setAssetTypes(res.assetTypes)
        }
    }
    return <BarcodeScanner onCapture={async ([b, ..._]) => onFinish(await props.handleTag(props, b?.rawValue || ""))} className={props.className || ""} />
}

export const Barcode = dynamic(() => Promise.resolve(BarcodeComponent), { ssr: false })