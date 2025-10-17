'use server'
import { get_project_data, get_projects } from "@/common/api.mts";
import { instanceConsts } from "@/common/consts.mjs";
import { InstanceConstsProvider } from "@/app/InstanceConstsProvider";
import { Tabs } from "@mantine/core";
import { Prep } from "./Prep";
import { Deprep } from "./Deprep";


export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const p_id = searchParams['p'];
    if (!p_id)
        throw Error("No project id!");
    const project_id = p_id as string;
    const name = searchParams['name'] || (await get_projects())
        .find(v => v.projects_id.toString() == project_id)
        ?.projects_name || "Unknown Project";

    return <>
        <div className="header">
            <h3 className="title">{name}</h3>
        </div>
        <Tabs variant="pills" defaultValue="prep">
            <Tabs.List>
                <Tabs.Tab value="prep">Prep</Tabs.Tab>
                <Tabs.Tab value="deprep">Deprep</Tabs.Tab>
                <Tabs.Tab value="advanced">Advanced</Tabs.Tab>
            </Tabs.List>
            <InstanceConstsProvider value={instanceConsts}>
                <Tabs.Panel value="prep">
                    <Prep project_id={project_id} />
                </Tabs.Panel>
                <Tabs.Panel value="depprep">
                    <Deprep />
                </Tabs.Panel>
                <Tabs.Panel value="advanced">
                    <Advanced />
                </Tabs.Panel>
            </InstanceConstsProvider>
        </Tabs>
    </>;
}