import { useCallback, useContext } from 'react';
import { AuthContext } from '../store/auth.context.jsx';
import { loginApi, registerApi, logoutApi } from '../services/auth.api.js';

export function useAuth() {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const { setUser, setLoading, setError, ...state } = context;

    const handleLogin = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await loginApi(email, password);
            setUser(response.user);
            return response;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading, setUser]);

    const handleRegister = useCallback(async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await registerApi(name, email, password);
            setUser(response.user);
            return response;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading, setUser]);

    const handleLogout = useCallback(async () => {
        setLoading(true);
        try {
            await logoutApi();
        } catch (err) {
            console.error('[Auth] Logout failed natively, but proceeding to clear local state', err);
        } finally {
            setUser(null);
            setLoading(false);
        }
    }, [setLoading, setUser]);

    // Also clear error on demand
    const clearError = useCallback(() => setError(null), [setError]);

    return { ...state, handleLogin, handleRegister, handleLogout, clearError };
}
