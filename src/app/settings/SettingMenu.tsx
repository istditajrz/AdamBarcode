"use client";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";

import {
	Affix,
	Switch,
	Table,
	TableTbody,
	TableTd,
	TableTr,
	TextInput,
} from "@mantine/core";
import { ActionIcon, Modal } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

// @ts-ignore css import
import "@mantine/core/styles/Modal.css";
// @ts-ignore css import
import "@mantine/core/styles/ModalBase.css";
// @ts-ignore css import
import "@mantine/core/styles/Input.css";
// @ts-ignore css import
import "@mantine/core/styles/Switch.css";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

export type Settings = {
	camera_barcode: boolean;
};

const settingsDescription = {
	camera_barcode: "Use camera for tag input",
} as { [k in keyof Settings]: string };

function SettingsMenuComponent({ className }: { className?: string }) {
	"use client";
	const store = localStorage.getItem("settings");
	const [settings, setSettings] = useState(
		!!store
			? JSON.parse(store)
			: {
					camera_barcode: false,
				},
	);
	const [opened, { open }] = useDisclosure(false);
	const close = () => {
		const s = JSON.stringify(settings);
		if (s !== store) {
			localStorage.setItem("settings", s);
			window.location.reload();
		}
	};

	const setKey = (k: keyof Settings, v: any) =>
		setSettings(
			Object.fromEntries([
				...Object.entries(settings),
				[k, v],
			]) as Settings,
		);

	return (
		<>
			<Modal opened={opened} onClose={close} title="Settings" centered>
				<Table>
					<TableTbody>
						<TableTr>
							<TableTd>
								<span>
									{settingsDescription.camera_barcode}
								</span>
							</TableTd>
							<TableTd>
								<Switch
									checked={settings.camera_barcode}
									onChange={(n) =>
										setKey(
											"camera_barcode",
											n.currentTarget.checked,
										)
									}
								/>
							</TableTd>
						</TableTr>
					</TableTbody>
				</Table>
			</Modal>
			<Affix position={{ top: 20, right: 20 }}>
				<ActionIcon
					variant="filled"
					aria-label="Settings"
					onClick={open}
					className={className || ""}
				>
					<FontAwesomeIcon icon={faGear} />
				</ActionIcon>
			</Affix>
		</>
	);
}

export const SettingsMenu = dynamic(
	() => Promise.resolve(SettingsMenuComponent),
	{ ssr: false },
);
