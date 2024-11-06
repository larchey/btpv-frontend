import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import PasswordForm from './PasswordForm';

const PasswordList = ({ groupId, passwords, onCreatePassword }) => {
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
        <PasswordForm onSubmit={onCreatePassword} />

        <div className="mt-6 space-y-4">
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
              {password.notes && (
                <p className="text-sm mt-2">{password.notes}</p>
              )}
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordList;