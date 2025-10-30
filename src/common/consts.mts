export type InstanceConsts = typeof instanceConsts;

export const instanceConsts = {
	instance: parseInt(process.env.INSTANCE!),
	// asset_prefixes: JSON.parse(process.env.ASSET_PREFIXES!) as string[],
	projectStatuses: {
		prep: parseInt(process.env.PREP_PROJ_STATUS!),
		prepped: parseInt(process.env.PREPPED_PROJ_STATUS!),
		deprep: parseInt(process.env.DEPREP_PROJ_STATUS!),
		deprepped: parseInt(process.env.DEPREPPED_PROJ_STATUS!),
	},
	assignmentStatuses: {
		prep: parseInt(process.env.PREP_ASSET_STATUS!),
		prepped: parseInt(process.env.PREPPED_ASSET_STATUS!),
		deprep: parseInt(process.env.DEPREP_ASSET_STATUS!),
		deprepped: parseInt(process.env.DEPREPPED_ASSET_STATUS!),
	},
} as const;
