// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const {token, userType} = await login(email, password); // uses apiFetch via AuthContext
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      if(userType === 'student') navigate('/dashboard');
    } catch (error) {
      // apiFetch / AuthContext may throw Error with .payload
      const message = error?.payload?.message || error?.message || 'Login failed';
      setErr(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="w-full max-w-md p-8 bg-white rounded shadow" onSubmit={onSubmit}>
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign in</h2>
        {err && <div className="text-sm text-red-600 mb-4">{err}</div>}

        <label className="block mb-3">
          <span className="text-sm">Email</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border rounded px-3 py-2"
            autoComplete="email"
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm">Password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="mt-1 block w-full border rounded px-3 py-2"
            autoComplete="current-password"
          />
        </label>

        <button
          type="submit"
          className={`w-full py-2 text-white rounded ${authLoading ? 'bg-gray-400' : 'bg-indigo-600'}`}
          disabled={authLoading}
        >
          {authLoading ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
