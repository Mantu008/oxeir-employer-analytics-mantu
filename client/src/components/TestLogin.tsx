import React, { useState } from "react";
import axios from "axios";

const TestLogin: React.FC = () => {
    const [email, setEmail] = useState("test@employer.com");
    const [password, setPassword] = useState("password123");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_API_URL}users/login`,
                {
                    email,
                    password,
                }
            );

            const { token } = response.data;
            localStorage.setItem("token", token);
            setMessage(
                "Login successful! Token saved to localStorage. Refresh the page to see the dashboard."
            );

            // Reload the page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            setMessage("Login failed. Please try again.");
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGetTestToken = async () => {
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_APP_API_URL}users/test-token`
            );
            const { token } = response.data;
            localStorage.setItem("token", token);
            setMessage(
                "Test token generated and saved! Refresh the page to see the dashboard."
            );

            // Reload the page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            setMessage("Failed to get test token. Please try again.");
            console.error("Token error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Test Login
                </h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="mt-4 pt-4 border-t">
                    <button
                        onClick={handleGetTestToken}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                    >
                        {loading ? "Getting Token..." : "Get Test Token"}
                    </button>
                </div>

                {message && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm text-blue-800">{message}</p>
                    </div>
                )}

                <div className="mt-4 text-xs text-gray-500">
                    <p>
                        This is a development login. Any email/password
                        combination will work.
                    </p>
                    <p>
                        The test token will give you access to the analytics
                        dashboard.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TestLogin;
