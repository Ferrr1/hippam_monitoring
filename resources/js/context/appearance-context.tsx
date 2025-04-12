import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

interface AppearanceContextType {
    appearance: Appearance;
    updateAppearance: (appearance: Appearance) => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

const prefersDark = () => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

const applyTheme = (appearance: Appearance) => {
    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());
    document.documentElement.classList.toggle('dark', isDark);
};

export const AppearanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [appearance, setAppearance] = useState<Appearance>('system');

    const updateAppearance = useCallback((newAppearance: Appearance) => {
        setAppearance(newAppearance);
        localStorage.setItem('appearance', newAppearance);
        applyTheme(newAppearance);
    }, []);

    useEffect(() => {
        const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'system';
        setAppearance(savedAppearance);
        applyTheme(savedAppearance);

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            const current = localStorage.getItem('appearance') as Appearance;
            applyTheme(current || 'system');
        };
        media.addEventListener('change', handleChange);

        return () => media.removeEventListener('change', handleChange);
    }, []);

    return (
        <AppearanceContext.Provider value={{ appearance, updateAppearance }}>
            {children}
        </AppearanceContext.Provider>
    );
};

export const useAppearance = () => {
    const context = useContext(AppearanceContext);
    if (!context) throw new Error('useAppearance must be used within AppearanceProvider');
    return context;
};
