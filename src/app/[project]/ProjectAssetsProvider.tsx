'use client'

import { type ReactNode, createContext } from 'react';
import type { InstanceAssets } from '@/common/api.mts';

export const ProjectAssetsContext = createContext<InstanceAssets>({});

export function ProjectAssetsProvider({
    children,
    value
}: {
    children: ReactNode,
    value: InstanceAssets
}) {
    return <ProjectAssetsContext.Provider value={value}>
        {children}
    </ProjectAssetsContext.Provider>
}