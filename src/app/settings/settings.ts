"use client";
import dynamic from "next/dynamic";
import type { Settings } from "./SettingMenu";

let stringsettings: string = "{}";
let settings: Settings | undefined = undefined;

export function getSettings(): Settings | undefined {
	"use client";
	if (typeof window !== "undefined") {
		const new_settings = localStorage.getItem("settings");
		if (!new_settings) {
			return undefined;
		}
		if (new_settings === stringsettings) {
			return settings;
		} else {
			settings = JSON.parse(new_settings);
			stringsettings = new_settings;
			return settings;
		}
	}
}
