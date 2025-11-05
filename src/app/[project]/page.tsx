"use server";
// @ts-ignore css import
import "@mantine/core/styles/Tabs.css";

import { get_project_assets, get_project_data } from "@/common/api.mts";
import { instanceConsts } from "@/common/consts.mts";
import { InstanceConstsProvider } from "@/app/InstanceConstsProvider";
import {
	Card,
	CardSection,
	Tabs,
	TabsList,
	TabsPanel,
	TabsTab,
	Title,
} from "@mantine/core";
import { Prep } from "./Prep/Prep";
import { Deprep } from "./Deprep/Deprep";
import { server_unwrap } from "@/common/helpers.mts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default async function Page({
	params,
	searchParams,
}: {
	params: Promise<{ project: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const project_id = (await params).project;

	let _name = (await searchParams)["name"];
	if (!_name) {
		_name =
			server_unwrap(await get_project_data(project_id)).projects_name ||
			"Unknown Project";
	} else {
		_name = decodeURIComponent(_name.toString());
	}
	const name: string = _name;

	const proj_assets = server_unwrap(await get_project_assets(project_id))[
		instanceConsts.instance
	]!;

	return (
		<Card className="shadow-lg bg-white-500 m-auto md:w-3/4 w-full h-fit">
			<CardSection className="w-full! m-auto pt-[2.5%] pb-[2.5%] bg-green-500 h-[10%]! relative">
				<Link href="/">
					<FontAwesomeIcon
						icon={faArrowLeft}
						className="text-white-500 pl-[2.5%] absolute m-auto text-3xl h-9!"
					/>
				</Link>
				<Title
					id="title"
					className="text-white-500 w-full! text-center text-3xl font-semibold"
				>
					{name}
				</Title>
			</CardSection>
			<CardSection>
				<Tabs variant="pills" defaultValue="prep" className="w-full">
					<TabsList className="w-fit m-auto pt-3 pb-3">
						<TabsTab value="prep">Prep</TabsTab>
						<TabsTab value="deprep">Deprep</TabsTab>
						{
							// <TabsTab value="advanced">Advanced</TabsTab>
						}
					</TabsList>
					<InstanceConstsProvider value={instanceConsts}>
						<TabsPanel value="prep">
							<Prep
								project_id={project_id}
								proj_assets={proj_assets}
							/>
						</TabsPanel>
						<TabsPanel value="deprep">
							<Deprep
								project_id={project_id}
								proj_assets={proj_assets}
							/>
						</TabsPanel>
						{
							// <Tabs.Panel value="advanced">
							//     <Advanced />
							// </Tabs.Panel>
						}
					</InstanceConstsProvider>
				</Tabs>
			</CardSection>
		</Card>
	);
}
