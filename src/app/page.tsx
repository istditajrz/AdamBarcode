'use server'

import Link from 'next/link';
import { Table, UnstyledButton } from '@mantine/core';
import { type Project, get_projects, get_project_data } from '@/common/api.mts';
import { instanceConsts } from '@/common/consts.mjs'

const relevant_project_statuses = [
    instanceConsts.projectStatuses.prep,
    instanceConsts.projectStatuses.deprep
];

function ProjRow({ project }: { project: Project }) {
    return <UnstyledButton component={Link} href={`/projects/?p=${project.projects_id}&name=${project.projects_name}`}>
        <Table.Tr id={project.projects_id.toString()}>
            <Table.Td className={'id'}>{project.projects_id}</Table.Td>
            <Table.Td className={'project'}>{project.projects_name}</Table.Td>
            <Table.Td className={'client'}>{project.clients_name}</Table.Td>
        </Table.Tr>
    </UnstyledButton>;
}

export default async function Page() {
    const all_projects = await get_projects();
    const projects_data = await Promise.all(
        all_projects.map(p => get_project_data(p.projects_id))
    );
    const relevant_projects = projects_data
        .filter(v => relevant_project_statuses.includes(v.projectsStatuses_id))
        .sort((a, b) => Date.parse(a.project_dates_deliver_start) - Date.parse(b.project_dates_deliver_start));

    return <>
        <div className='header'>
            <h3 id='title'>Projects</h3>
        </div>
        <Table highlightOnHover stickyHeader stickyHeaderOffset={60} className={'body'}>
            <Table.Thead>
                <Table.Th>Id</Table.Th>
                <Table.Th>Project Name</Table.Th>
                <Table.Th>Client</Table.Th>
            </Table.Thead>
            <Table.Tbody>
                {relevant_projects.map(v => <ProjRow project={v} />)}
            </Table.Tbody>
        </Table>
    </>;
}