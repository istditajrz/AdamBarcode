"use client";
import type { Asset } from "@/common/api.mjs";

export type AssetType = {
	id: number;
	name: string;
	assets: Asset[];
	length?: string;
};

export function checkLengthEq(a: AssetType, b: Asset): boolean {
	return (a.length || "") == b.asset_definableFields_1;
}

export function dedupTypes(requested: Asset[]): AssetType[] {
	const types: Record<number, AssetType> = {};
	for (const r of requested) {
		if (
			Object.hasOwn(types, r.assetTypes_id) &&
			checkLengthEq(types[r.assetTypes_id]!, r)
		) {
			types[r.assetTypes_id]!.assets.push(r);
		} else {
			types[r.assetTypes_id] = {
				id: r.assetTypes_id,
				name: r.assetTypes_name,
				assets: [r],
			};
			if (r.assetTypes_definableFields_ARRAY[0] == "Length (m)") {
				types[r.assetTypes_id]!.length = r.asset_definableFields_1;
			}
		}
	}
	return Object.values(types);
}
