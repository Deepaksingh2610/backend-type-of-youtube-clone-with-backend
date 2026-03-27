import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const isEmail = formData.identifier.includes('@');
      const payload = {
        [isEmail ? 'email' : 'username']: formData.identifier,
        password: formData.password
      };

      const response = await axiosInstance.post('/users/login', payload, {
        withCredentials: true
      });
      login(response.data.data.user);
      navigate('/');
    } catch (err) {
      console.error('Login error detail:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-[100] px-4">
      <div className="w-full max-w-md bg-secondary/50 backdrop-blur-xl border border-secondary p-8 rounded-2xl flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center font-bold text-2xl text-black">V</div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-400">Enter your credentials to access videoadda</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Username or Email"
            placeholder="example@gmail.com"
            value={formData.identifier}
            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Button type="submit" loading={loading} className="mt-2 w-full">Sign In</Button>
        </form>

        <p className="text-center text-gray-400 text-sm">
          Don't have an account? <Link to="/signup" className="text-accent hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
