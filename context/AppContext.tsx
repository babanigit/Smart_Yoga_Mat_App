// context/AppContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the structure of the context
interface Analytics {
  totalSessions: number;
  mostUsedFunction: string;
}

interface AppContextType {
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
  currentVersion: string;
  setCurrentVersion: (version: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  selectedSound: string | null;
  setSelectedSound: (sound: string | null) => void;
  analytics: Analytics;
  setAnalytics: (analytics: Analytics) => void;
}

// Default values for the context
const defaultContextValue: AppContextType = {
  isConnected: false,
  setIsConnected: () => {},
  currentVersion: '1.0.0',
  setCurrentVersion: () => {},
  soundEnabled: true,
  setSoundEnabled: () => {},
  selectedSound: null,
  setSelectedSound: () => {},
  analytics: {
    totalSessions: 0,
    mostUsedFunction: 'Warm-Up',
  },
  setAnalytics: () => {},
};

// Create the context with the default value and type
const AppContext = createContext<AppContextType>(defaultContextValue);

// Define a Provider component with children type
interface ProviderProps {
  children: ReactNode;
}

export function Provider({ children }: ProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [currentVersion, setCurrentVersion] = useState('1.0.0');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalSessions: 0,
    mostUsedFunction: 'Warm-Up',
  });

  return (
    <AppContext.Provider
      value={{
        isConnected,
        setIsConnected,
        currentVersion,
        setCurrentVersion,
        soundEnabled,
        setSoundEnabled,
        selectedSound,
        setSelectedSound,
        analytics,
        setAnalytics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for using the context
export function useAppContext() {
  return useContext(AppContext);
}
