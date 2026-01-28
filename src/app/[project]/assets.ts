import type { Asset } from "@/common/api.mjs";

export type AssetType = {
	id: number;
	name: string;
	assets: Asset[];
	length?: string;
};

function key(id: number | string, length: number | string | null): string {
	return `${id}${length || "unknown"}`;
}

export function checkLengthEq(a: AssetType, b: Asset): boolean {
	return (a.length || "") == (b.asset_definableFields_1 || "");
}

export function dedupTypes(requested: Asset[]): AssetType[] {
	const types: Record<string, AssetType> = {};
	for (const r of requested) {
		let r_key = key(r.assetTypes_id, null);
		if (r.assetTypes_definableFields_ARRAY[0] == "Length (m)" || r.assetTypes_definableFields.startsWith('Length (m)')) {
			r_key = key(r.assetTypes_id, r.asset_definableFields_1);
		}
		if (
			Object.hasOwn(types, r_key) &&
			checkLengthEq(types[r_key]!, r)
		) {
			types[r_key]!.assets.push(r);
		} else {
			types[r_key] = {
				id: r.assetTypes_id,
				name: r.assetTypes_name,
				length: r.asset_definableFields_1,
				assets: [r],
			};
		}

	}
	return Object.values(types);
}
