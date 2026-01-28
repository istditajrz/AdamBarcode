"use client";

// @ts-ignore css import
import "@mantine/core/styles/Input.css";

import {
	faHashtag,
	faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextInput } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

import { type ComponentProps } from "./TagInput";
import dynamic from "next/dynamic";

function TextTagInputComponent(props: ComponentProps) {
	const [success, setSuccess] = useState<{ res: boolean; error?: string }>({
		res: true,
	});
	const tag = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setTimeout(
			() =>
			(tag.current!.onkeydown = async (e) => {
				if (e.key === "Enter") {
					const res = await props.handleTag(
						props,
						tag.current!.value.toUpperCase(),
					);
					if (!res.res) {
						// Fire "failure"
						setSuccess(res);
						// Reset
						setTimeout(() => {
							setSuccess({ res: true });
							tag.current!.value = "";
						}, 5 * 1000);
					} else {
						tag.current!.value = "";
					}
					if (res.assetTypes != null) {
						props.setAssetTypes(res.assetTypes);
					}
				}
			}),
		);
	}, [tag, props]);
	return (
		<TextInput
			ref={tag}
			aria-label="Tag Input"
			placeholder="A-1234"
			autoFocus
			leftSection={
				<FontAwesomeIcon
					icon={success ? faHashtag : faCircleExclamation}
				/>
			}
			error={success.res ? false : success.error || true}
			className={props.className || ""}
		/>
	);
}

export const TextTagInput = dynamic(
	() => Promise.resolve(TextTagInputComponent),
	{ ssr: false },
);
