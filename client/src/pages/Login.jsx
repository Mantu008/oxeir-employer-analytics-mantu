import React from 'react';

const Login = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Employer Login</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input type="email" className="input" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input type="password" className="input" />
                </div>
                <button type="submit" className="btn btn-primary w-full">Login</button>
            </form>
        </div>
    );
};

export default Login; 