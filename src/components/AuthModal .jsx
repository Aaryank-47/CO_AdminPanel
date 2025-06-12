// src/components/AuthModal.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-hot-toast";
import { XIcon } from "../components/Icons.jsx";

const AuthModal = () => {
    const {
        showAuthModal,
        closeAuthModal,
        authMode,
        login,
        signup
    } = useAuth();
    const [formData, setFormData] = useState({
        adminName: "",
        collegeName: "",
        phoneNumber: "",
        adminEmail: "",
        adminPassword: "",
        confirmPassword: "",
        role: "admin",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (authMode === "login") {
            login(formData.adminEmail, formData.adminPassword);
        } else {
            if (formData.adminPassword !== formData.confirmPassword) {
                toast.error("Passwords don't match");
                return;
            }
            signup({
                adminName: formData.adminName,
                adminEmail: formData.adminEmail,
                phoneNumber: formData.phoneNumber,
                collegeName: formData.collegeName,
                adminPassword: formData.adminPassword,
                role: formData.role
            });
        }
    };

    if (!showAuthModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md relative">
                <button
                    onClick={closeAuthModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                    <XIcon className="w-6 h-6" />
                </button>

                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                        {authMode === "login" ? "Sign in to your account" : "Create an admin account"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {authMode === "signup" && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="adminName"
                                    type="text"
                                    required
                                    value={formData.adminName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                College Name
                            </label>
                            <input
                                id="clg_name"
                                name="collegeName"
                                type="text"
                                required
                                value={formData.collegeName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Phone Number
                            </label>
                            <input
                                id="phn_no"
                                name="phoneNumber"
                                type="number"
                                required
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="adminEmail"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.adminEmail}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="adminPassword"
                                type="password"
                                required
                                value={formData.adminPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        {authMode === "signup" && (
                            <>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Role
                                    </label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="superadmin">Super Admin</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                {authMode === "login" ? "Sign in" : "Create account"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-4 text-center">
                        <button
                            onClick={() => {
                                setFormData({
                                    adminName: "",
                                    collegeName: "",
                                    phoneNumber: "",
                                    adminEmail: "",
                                    adminPassword: "",
                                    confirmPassword: "",
                                    role: "admin",
                                });
                                authMode === "login"
                                    ? setAuthMode("signup")
                                    : setAuthMode("login");
                            }}
                            className="text-purple-600 dark:text-purple-400 hover:text-purple-500 text-sm font-medium"
                        >
                            {authMode === "login"
                                ? "Need an account? Sign up"
                                : "Already have an account? Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;