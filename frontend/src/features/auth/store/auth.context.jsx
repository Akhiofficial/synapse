import React, { createContext, useState, useEffect, useMemo } from 'react';
import { getCurrentUserApi } from '../services/auth.api.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await getCurrentUserApi();
                setUser(response.user);
            } catch (err) {
                // Cookie not present or expired
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        verifySession();
    }, []);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: !!user,
            loading,
            error,
            setUser,
            setLoading,
            setError,
        }),
        [user, loading, error]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
