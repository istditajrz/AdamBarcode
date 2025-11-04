// @ts-ignore css import
import "@mantine/core/styles/Table.css";

import { Table } from "@mantine/core";
import { type AssetType } from "./assets";

export function ListAssets({
	asset_list,
	className,
}: {
	asset_list: AssetType[];
	className?: string;
}) {
	const row = (asset_type: AssetType, index: number) => (
		<Table.Tr key={index} className="text-xl">
			<Table.Td>{asset_type.assets.length}</Table.Td>
			<Table.Td>{asset_type.name}</Table.Td>
			<Table.Td>{asset_type.length || ""}</Table.Td>
		</Table.Tr>
	);
	return (
		<Table
			stickyHeader
			stickyHeaderOffset={60}
			id="prep_list"
			className={`${className} mb-[2%]`}
		>
			<Table.Thead>
				<Table.Tr>
					<Table.Th>Quantity</Table.Th>
					<Table.Th>Name</Table.Th>
					<Table.Th>Length</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>{asset_list.map(row)}</Table.Tbody>
		</Table>
	);
}
