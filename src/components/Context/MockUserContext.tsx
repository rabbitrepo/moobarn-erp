// src/components/Context/MockUserContext.tsx

import React, { createContext, useContext, ReactNode } from 'react';

const MockUserContext = createContext<any>(null);

export function useMockUserContext() {
    return useContext(MockUserContext);
}

export function MockUserProvider({ children, mockValue }: { children: ReactNode, mockValue: any }) {
    return (
        <MockUserContext.Provider value={mockValue}>
            {children}
        </MockUserContext.Provider>
    );
}
