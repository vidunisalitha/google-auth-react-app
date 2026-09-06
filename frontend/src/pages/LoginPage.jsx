import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LoginBtn from "../components/LoginBtn";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
    const { user, loading, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [logginIn, setLogginIn] = useState(false);

    const handleLogin = async (credential) => {
        try {
            setError("");
            setLogginIn(true);
            await loginWithGoogle(credential);
            toast.success("Signed in successfully");

            navigate("/home", {
                replace: true,
            });
        }
        catch (err) {
            console.error("Login failed: ", err);

            const message = err.message || "Unable to sign in with Google. Please try again.";
            setError(message);
            toast.error(message);
        }
        finally {
            setLogginIn(false);
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <p className="text-gray-600">Checking authentication...</p>
            </div>
        )
    }

    if (user) {
        return (
            <Navigate to="/home" replace />
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-900"> Google Auth Application </h1>
                    <p className="mt-2 text-sm text-gray-500"> Sign in with your Google account to continue </p>
                </div>
                <div className="mt-8 flex justify-center">
                    <LoginBtn onSuccess={handleLogin} />
                </div>
                {logginIn && (
                    <p className="mt-4 text-center text-sm text-gray-500"> Authenticating with Google... </p>
                )}
                {error && (
                    <div className="mt-4 rounded-md bg-red-50 p-3 text-center text-sm text-red-700">
                        {error}
                    </div>
                )}
            </div>
        </div>
    )
}