'use server'
// @ts-expect-error
import "@mantine/core/styles/Table.css"

import Link from 'next/link';
import { Table, TableThead, TableTh, TableTbody, TableTr, TableTd, Title, Card, CardSection } from '@mantine/core';
import { type Project, get_projects, get_project_data, type Response } from '@/common/api.mts';
import { server_unwrap, Ok } from "@/common/helpers.mts";
import { instanceConsts } from '@/common/consts.mts'

const relevant_project_statuses = [
    instanceConsts.projectStatuses.prep,
    instanceConsts.projectStatuses.deprep
];

async function ProjRow({ project }: { project: Project }) {
    'use client'
    const link_href = `/${project.projects_id}/?name=${encodeURIComponent(project.projects_name)}`;
    return <TableTr
        id={project.projects_id.toString()}
        className='pl-2 pb-4 mb-4'
    >
        <TableTd className={'id'}><Link href={link_href}>{project.projects_id}</Link></TableTd>
        <TableTd className={'project'}><Link href={link_href}>{project.projects_name}</Link></TableTd>
        <TableTd className={'client'}><Link href={link_href}>{project.clients_name}</Link></TableTd>
    </TableTr>
}

async function get_relevant_projects(): Promise<Project[]> {
    const all_projects = server_unwrap(await get_projects());

    const projects_data = await Promise.all(
        all_projects
            .map(p => get_project_data(p.projects_id))
    );
    const data = projects_data
        .map(server_unwrap)
        .filter(v =>
            relevant_project_statuses.includes(v.projectsStatuses_id)
        )
        .sort((a, b) => Date.parse(a.project_dates_deliver_start) - Date.parse(b.project_dates_deliver_start));
    return data;
}

export default async function Page() {
    const relevant_projects = await get_relevant_projects();
    return <Card className='shadow-lg bg-white-500 m-auto md:w-3/4 w-full h-fit'>
        <CardSection className='w-full! pt-3 pb-3 m-auto bg-green-500'>
            <Title id='title' className='text-white-500 text-center w-full!'>Projects</Title>
        </CardSection>
        <CardSection>
            <Table
                className='w-[90%]! mt-[2%] mb-[2%] mr-[5%] ml-[5%] min-h-full'
                withRowBorders={true}
            >
                <TableThead>
                    <TableTr>
                        <TableTh>Id</TableTh>
                        <TableTh>Project Name</TableTh>
                        <TableTh>Client</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {
                        relevant_projects.map(v => <ProjRow key={v.projects_id} project={v} />)
                    }
                </TableTbody>
            </Table>
        </CardSection>
    </Card >;
}