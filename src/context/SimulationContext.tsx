import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { db, type SimulationSettings, DEFAULT_SETTINGS } from '@/services/mocks/db';

interface SimulationContextType extends SimulationSettings {
    updateSettings: (settings: Partial<SimulationSettings>) => Promise<void>;
    resetSettings: () => Promise<void>;
    isLoading: boolean;
}

const SimulationContext = createContext<SimulationContextType | null>(null);

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<SimulationSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);

    // Load initial settings
    useEffect(() => {
        db.getSettings().then((s) => {
            setSettings(s);
            setIsLoading(false);
        });
    }, []);

    const updateSettings = async (updates: Partial<SimulationSettings>) => {
        const newSettings = { ...settings, ...updates };
        setSettings(newSettings); // Optimistic update
        await db.updateSettings(newSettings);
    };

    const resetSettings = async () => {
        setSettings(DEFAULT_SETTINGS);
        await db.updateSettings(DEFAULT_SETTINGS);
    };

    return (
        <SimulationContext.Provider value={{ ...settings, updateSettings, resetSettings, isLoading }}>
            {children}
        </SimulationContext.Provider>
    );
};

export const useSimulation = () => {
    const context = useContext(SimulationContext);
    if (!context) {
        throw new Error('useSimulation must be used within a SimulationProvider');
    }
    return context;
};
