"use client";
import { type Dispatch, type SetStateAction } from "react";
import { type AssetType } from "../assets";
import { client_unwrap } from "@/common/helpers.mts";
import { getSettings } from "@/app/settings/settings";
import { Barcode } from "./Barcode";
import { TextTagInput } from "./Text";
import dynamic from "next/dynamic";
import { handleTag } from "../Prep/handleTag";

const tone_duration = 0.5; // s
const success_f = 520; // Hz
const fail_f_0 = 480; // Hz
const fail_f_1 = 400; // Hz

function playSuccess() {
	const context = new window.AudioContext();
	const oscillator = context.createOscillator();
	oscillator.connect(context.destination);
	oscillator.type = "sine";
	oscillator.frequency.setValueAtTime(success_f, context.currentTime);
	oscillator.frequency.setValueAtTime(0, context.currentTime + tone_duration);
	oscillator.start()
	setTimeout(() => oscillator.disconnect(), tone_duration + 2 * 1000);
}

function playFailed() {
	const context = new window.AudioContext();
	const oscillator = context.createOscillator();
	oscillator.connect(context.destination);
	oscillator.type = "sine";
	oscillator.frequency.setValueAtTime(fail_f_0, context.currentTime);
	oscillator.frequency.setValueAtTime(fail_f_1, context.currentTime + (tone_duration / 2));
	oscillator.frequency.setValueAtTime(0, context.currentTime + tone_duration);
	oscillator.start();
	setTimeout(() => oscillator.disconnect(), tone_duration + 2 * 1000);
}

export type Success = {
	res: boolean;
	assetTypes: AssetType[] | null;
	error?: string;
};

export type HandleTagProps = {
	project_id: string | number;
	assetTypes: AssetType[];
};

export type ComponentProps = HandleTagProps & {
	setAssetTypes: Dispatch<SetStateAction<AssetType[]>>;
	handleTag: (props: HandleTagProps, tag: string) => Promise<Success>;
	className?: string;
};

function TagInputComponent(props: ComponentProps) {
	"use client";
	const settings = getSettings();
	if (!settings) {
		client_unwrap({ result: false, error: { message: "No settings!" } });
	}
	const { handleTag, ...lite_props } = props;
	const wrap_props: ComponentProps = {
		handleTag: (p, t) => (
			handleTag(p, t)
				.then(v => {
					v.res ? playSuccess() : playFailed();
					return v;
				})
		),
		...lite_props
	};
	return settings?.camera_barcode ? (
		<Barcode {...wrap_props} className="w-full! md:w-1/2! h-1/2! m-auto" />
	) : (
		<TextTagInput {...wrap_props} />
	);
}

export const TagInput = dynamic(() => Promise.resolve(TagInputComponent), {
	ssr: false,
});
