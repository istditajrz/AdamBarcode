'use client'

import { type ReactNode, createContext, useContext } from 'react';
import { type InstanceConsts } from '@/common/api.mjs';

export const InstanceConstsContext = createContext<InstanceConsts>({
    instance: -1,
    projectStatuses: {
        prep: -1,
        prepped: -1,
        deprep: -1,
        deprepped: -1
    },
    assignmentStatuses: {
        prep: -1,
        prepped: -1,
        deprep: -1,
        deprepped: -1
    }
});

export function useInstanceConsts() {
    return useContext(InstanceConstsContext);
}

export function InstanceConstsProvider({
    children,
    value
}: {
    children: ReactNode,
    value: InstanceConsts
}) {
    return <InstanceConstsContext.Provider value={value}>
        {children}
    </InstanceConstsContext.Provider>;
}