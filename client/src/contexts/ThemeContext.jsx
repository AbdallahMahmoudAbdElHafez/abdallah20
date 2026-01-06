import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { createAppTheme } from '../theme';

const ThemeContext = createContext();

const DEFAULT_CONFIG = {
    themeName: 'light',
    primaryColor: null,
    borderRadius: 12,
    fontFamily: 'Tajawal'
};

export const useAppTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useAppTheme must be used within a ThemeContextProvider');
    }
    return context;
};

export const ThemeContextProvider = ({ children }) => {
    const [config, setConfig] = useState(() => {
        const saved = localStorage.getItem('app_theme_config');
        return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    });

    const theme = useMemo(() => createAppTheme(config), [config]);

    useEffect(() => {
        localStorage.setItem('app_theme_config', JSON.stringify(config));
    }, [config]);

    const updateConfig = (newSettings) => {
        setConfig(prev => ({ ...prev, ...newSettings }));
    };

    const resetConfig = () => setConfig(DEFAULT_CONFIG);

    return (
        <ThemeContext.Provider value={{ ...config, updateConfig, resetConfig }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};
