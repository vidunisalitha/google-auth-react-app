import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const resp = await fetch(`${API_URL}/auth/saveduser`, {
                method: "GET",
                credentials: "include",
            });

            if (resp.status === 401) {
                setUser(null);
                return;
            }

            if (!resp.ok) {
                throw new Error(`Auth check failed with status ${resp.status}`);
            }

            const data = await resp.json();
            setUser(data.user);
        }
        catch (err) {
            console.error("Auth check failed:", err);
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async (credential) => {
        try {
            const resp = await fetch(`${API_URL}/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                credentials: "include",
                body: JSON.stringify({ credential }),
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(
                    data.message || "Google login failed"
                );
            }

            setUser(data.user);
            return data.user;
        }
        catch (err) {
            console.error("Google login error:", err);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        }
        catch (err) {
            console.error("Logout error:", err);
            throw err;
        }
        finally {
            setUser(null);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, loading, loginWithGoogle, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}