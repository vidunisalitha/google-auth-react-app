import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import toast from "react-hot-toast";

export default function HomePage() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
        }
        catch (err) {
            console.error("Logout failed:", err);
            toast.error("Logout failed. Please try again.");
        }

        navigate("/login", {
            replace: true,
        });
    }

    return(
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
                <h1 className="text-2xl font-semibold text-gray-900 text-center">Welcome</h1>
                <div className="mt-6 border-t border-b border-gray-200 py-5">
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{user?.name}</p>

                    <p className="mt-4 text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                </div>

                <button
                onClick={handleLogout} 
                className="mt-8 w-full rounded-md bg-red-900 px-4 py-2 text-white hover:bg-red-700">Logout</button>
            </div>
        </div>
    )
}