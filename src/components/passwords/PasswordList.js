import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const PasswordList = ({ 
  groupId, 
  passwords, 
  onCreatePassword 
}) => {
  const [newPassword, setNewPassword] = React.useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreatePassword({ ...newPassword, group_id: groupId });
    setNewPassword({
      title: '',
      username: '',
      password: '',
      url: '',
      notes: ''
    });
  };

  if (!groupId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Passwords</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">
            Select a group to view passwords
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Passwords</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="mb-4 space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Title"
              value={newPassword.title}
              onChange={(e) => setNewPassword(prev => ({
                ...prev,
                title: e.target.value
              }))}
            />
            <Input
              placeholder="Username"
              value={newPassword.username}
              onChange={(e) => setNewPassword(prev => ({
                ...prev,
                username: e.target.value
              }))}
            />
            <Input
              type="password"
              placeholder="Password"
              value={newPassword.password}
              onChange={(e) => setNewPassword(prev => ({
                ...prev,
                password: e.target.value
              }))}
            />
            <Input
              placeholder="URL"
              value={newPassword.url}
              onChange={(e) => setNewPassword(prev => ({
                ...prev,
                url: e.target.value
              }))}
            />
            <Input
              placeholder="Notes"
              value={newPassword.notes}
              onChange={(e) => setNewPassword(prev => ({
                ...prev,
                notes: e.target.value
              }))}
            />
          </div>
          <Button type="submit" className="w-full">Add Password</Button>
        </form>

        <div className="space-y-2">
          {passwords.map(password => (
            <Card key={password.id} className="p-4">
              <h3 className="font-bold">{password.title}</h3>
              <p className="text-sm">Username: {password.username}</p>
              <p className="text-sm">
                Password: <span className="font-mono">••••••••</span>
              </p>
              {password.url && (
                <p className="text-sm">URL: {password.url}</p>
              )}
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordList;