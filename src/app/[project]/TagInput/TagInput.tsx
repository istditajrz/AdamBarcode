"use client";
import { type Dispatch, type SetStateAction } from "react";
import { type AssetType } from "../assets";
import { client_unwrap } from "@/common/helpers.mts";
import { getSettings } from "@/app/settings/settings";
import { Barcode } from "./Barcode";
import { TextTagInput } from "./Text";
import dynamic from "next/dynamic";

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

	return settings?.camera_barcode ? (
		<Barcode {...props} className="w-full! md:w-1/2! h-1/2! m-auto" />
	) : (
		<TextTagInput {...props} />
	);
}

export const TagInput = dynamic(() => Promise.resolve(TagInputComponent), {
	ssr: false,
});
