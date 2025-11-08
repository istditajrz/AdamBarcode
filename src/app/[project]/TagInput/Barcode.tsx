"use client";
import { BarcodeScanner } from "react-barcode-scanner";
import "react-barcode-scanner/polyfill";
// import { BarcodeDetectorPolyfill } from "@preflower/barcode-detector-polyfill";
import type { ComponentProps, Success } from "./TagInput";
import { client_unwrap } from "@/common/helpers.mts";
import dynamic from "next/dynamic";
import { use } from "react";

// class BarcodeDetector {
// 	constructor() {
// 		Object.assign(this, (window as any).BarcodeDetector);
// 		return (window as any).BarcodeDetector;
// 	}
// }

function BarcodeComponent(props: ComponentProps) {
	if (typeof window === "undefined") {
		throw Error("THIS CANNOT BE A SERVER COMPONENT");
	}

	// try {
	// 	window.BarcodeDetector.getSupportedFormats();
	// 	// globalThis['BarcodeDetector'] = BarcodeDetector;
	// 	console.log('native');
	// } catch {
	// 	(window as any).BarcodeDetector = BarcodeDetectorPolyfill;
	// 	globalThis['BarcodeDetector'] = BarcodeDetectorPolyfill;
	// 	console.log('poly')
	// }

	// console.log(new Object(window).hasOwnProperty("BarcodeDetector"))

	function onFinish(res: Success) {
		if (!res.res) {
			client_unwrap({
				result: false,
				error: { message: res.error || "" },
			});
		}
		if (!!res.assetTypes) {
			props.setAssetTypes(res.assetTypes);
		}
	}
	const formats = (new BarcodeDetector() as unknown as { formats: string[] }).formats;

	return (
		<BarcodeScanner
			options={{ formats: formats }}
			onCapture={async ([b, ..._]) => {
				console.log(b);
				onFinish(await props.handleTag(props, b?.rawValue || ""));
			}}
			className={props.className || ""}
		/>
	);
}

export const Barcode = dynamic(() => Promise.resolve(BarcodeComponent), {
	ssr: false,
});
