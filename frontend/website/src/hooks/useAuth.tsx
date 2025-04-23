import { AuthContext } from "@/contexts/AuthContext";
import { createContext, useContext } from "react";


// Custom hook to use auth
export const useAuth = () => {

    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
