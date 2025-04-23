import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type User = {
    username: string;
    email?: string;
    // Add other fields as per your API response
};

type AuthContextType = {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    signup: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'auth_user';
const BASE_URL = 'http://gibbous.dev/api/v1/auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const storedUser = await AsyncStorage.getItem(USER_KEY);
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Error restoring user session:', error);
            } finally {
                setIsLoading(false);
            }
        };

        restoreSession();
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const res = await axios.post(`${BASE_URL}/login`, { username, password });

            if (res.data.status === 'success' && res.data.user) {
                await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
                setUser(res.data.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const signup = async (username: string, password: string): Promise<boolean> => {
        try {
            const res = await axios.post(`${BASE_URL}/signup`, { username, password });

            if (res.data.status === 'success' && res.data.user) {
                await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
                setUser(res.data.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Signup error:', error);
            return false;
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem(USER_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
