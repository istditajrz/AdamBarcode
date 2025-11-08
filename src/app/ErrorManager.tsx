"use client";
// @ts-ignore css imports
import "@mantine/core/styles/Alert.css";
// @ts-ignore css imports
import "@mantine/core/styles/Stack.css";
import { Alert, Stack } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

type ErrorMap = {
	[index: string]: { message: string };
};

export function ErrorManager({ children }: { children: React.ReactNode }) {
	const parentRef = useRef<HTMLDivElement>(null);
	let index = 0;
	const [errors, setErrors] = useState<ErrorMap>({});

	function addError(e: Event & { error: { message: string } }) {
		e.stopImmediatePropagation();
		e.stopPropagation();
		const i = `${index++}`;
		setErrors((errors) =>
			Object.fromEntries([...Object.entries(errors), [i, e.error]]),
		);
		setTimeout(() => {
			const { [i]: _, ...new_errors } = errors;
			setErrors(new_errors);
		}, 100 * 1000);
	}

	useEffect(() => {
		parentRef.current!.addEventListener("error", addError);
	});

	return (
		<>
			<Stack>
				{Object.entries(errors).map(([i, v]) => (
					<Alert
						key={i}
						variant="filled"
						color="red"
						withCloseButton
						title="Error"
						icon={<FontAwesomeIcon icon={faCircleInfo} />}
					>
						{v.message}
					</Alert>
				))}
			</Stack>
			<div ref={parentRef}>{children}</div>
		</>
	);
}
