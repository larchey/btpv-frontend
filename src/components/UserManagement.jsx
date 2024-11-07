import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, Check } from "lucide-react";
import { getUsers, createUser } from '../services/users';

const UserManagement = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    try {
      setError('');
      setLoading(true);
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      return;
    }
    fetchUsers();
  }, []);

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    is_admin: false
  });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await createUser(newUser);
      setSuccess('User created successfully');
      setNewUser({ username: '', email: '', password: '', is_admin: false });
      await fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to create user');
    }
  };

  if (!localStorage.getItem('token')) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please login to manage users</AlertDescription>
            </Alert>
            <Button onClick={onClose} className="mt-4 w-full">Close</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User Management</CardTitle>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
          <CardDescription>Create and manage users</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}

            {/* Create User Form */}
            <Card>
              <CardHeader>
                <CardTitle>Create New User</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <Input
                    placeholder="Username"
                    value={newUser.username}
                    onChange={(e) => setNewUser(prev => ({
                      ...prev,
                      username: e.target.value
                    }))}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({
                      ...prev,
                      password: e.target.value
                    }))}
                    required
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_admin"
                      checked={newUser.is_admin}
                      onChange={(e) => setNewUser(prev => ({
                        ...prev,
                        is_admin: e.target.checked
                      }))}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="is_admin">Admin User</label>
                  </div>
                  <Button type="submit" className="w-full">Create User</Button>
                </form>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <p>Loading users...</p>
                  ) : users.length === 0 ? (
                    <p className="text-center text-gray-500">No users found</p>
                  ) : (
                    users.map(user => (
                      <div key={user.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {user.is_admin && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              Admin
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            user.is_active 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;