import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export default function Login() {
  const { handleLoginSuccess } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://localhost:5227/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const msg = await response.text();
        setError(msg || 'Login failed');
        return;
      }

      const data = await response.json();
      handleLoginSuccess({
        token: data.token,
        role: data.role,
        username,
        patientId: data.patientId,
        physicianId: data.physicianId,
        pharmacistId: data.pharmacistId
      });
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#d8e9f6]"> {/* Softer background */}
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md"> {/* More rounded, deeper shadow */}
        
        {/* Logo */}
        <div className="flex justify-center ">
          <img 
            src="/assets/Vytall_logo.png" 
            alt="Vytall Logo" 
            className="h-56 object-contain"
          />
        </div>

        {/* Subtitle */}
        <h2 className="text-lg font-medium text-center text-gray-600 mb-6">Login to your account</h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ab4d8] focus:border-transparent"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ab4d8] focus:border-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Error Message */}
          {error && <div className="text-red-500 text-center">{error}</div>}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#7fb5e7] text-white p-3 rounded-full font-semibold hover:bg-[#6aa3db] transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}