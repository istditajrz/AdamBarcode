'use server'
// @ts-expect-error
import "@mantine/core/styles/Tabs.css"

import { get_project_assets, get_project_data, get_projects } from "@/common/api.mts";
import { instanceConsts } from "@/common/consts.mts";
import { InstanceConstsProvider } from "@/app/InstanceConstsProvider";
import { Card, CardSection, Tabs, TabsList, TabsPanel, TabsTab, Title } from "@mantine/core";
import { Prep } from "./Prep/Prep";
import { Deprep } from "./Deprep/Deprep";
import { ProjectAssetsProvider } from "./ProjectAssetsProvider";
import { server_unwrap } from "@/common/helpers.mts";


export default async function Page({ params, searchParams }: { params: Promise<{ project: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const project_id = (await params).project;

    let _name = (await searchParams)['name'];
    if (!_name) {
        _name = server_unwrap(await get_project_data(project_id))
            .projects_name || "Unknown Project"
    } else {
        _name = decodeURIComponent(_name.toString());
    }
    const name: string = _name;

    const project_assets = server_unwrap(await get_project_assets(project_id));

    return <Card className='shadow-lg bg-white-500 m-auto md:w-3/4 w-full h-fit'>
        <CardSection className='w-full! pt-3 pb-3 m-auto bg-green-500'>
            <Title id="title" className='text-white-500 text-center w-full!'>{name}</Title>
        </CardSection>
        <CardSection>
            <Tabs variant="pills" defaultValue="prep" className="w-full">
                <TabsList className="w-fit m-auto pt-3 pb-3">
                    <TabsTab value="prep">Prep</TabsTab>
                    <TabsTab value="deprep">Deprep</TabsTab>
                    { // <TabsTab value="advanced">Advanced</TabsTab>
                    }
                </TabsList>
                <InstanceConstsProvider value={instanceConsts}>
                    <ProjectAssetsProvider value={project_assets[instanceConsts.instance]!}>
                        <TabsPanel value="prep">
                            <Prep project_id={project_id} />
                        </TabsPanel>
                        <TabsPanel value="deprep">
                            <Deprep project_id={project_id} />
                        </TabsPanel>
                        {
                            // <Tabs.Panel value="advanced">
                            //     <Advanced />
                            // </Tabs.Panel>
                        }
                    </ProjectAssetsProvider>
                </InstanceConstsProvider>
            </Tabs>
        </CardSection>
    </Card>;
}