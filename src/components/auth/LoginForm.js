import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from '../../services/auth';

const LoginForm = ({ onLoginSuccess }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.username, form.password);
      onLoginSuccess();
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Password Vault Login</CardTitle>
          <CardDescription>Please login to access your passwords</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                type="text"
                value={form.username}
                onChange={(e) => setForm(prev => ({
                  ...prev,
                  username: e.target.value
                }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;