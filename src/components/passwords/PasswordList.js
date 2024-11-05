import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import PasswordForm from './PasswordForm';

const PasswordList = ({ 
  groupId, 
  passwords, 
  onCreatePassword 
}) => {
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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Password</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordForm
            groupId={groupId}
            onSubmit={onCreatePassword}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stored Passwords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {passwords.map(password => (
              <Card key={password.id} className="bg-gray-50">
                <CardContent className="p-4">
                  <h3 className="font-bold">{password.title}</h3>
                  <p className="text-sm">Username: {password.username}</p>
                  <p className="text-sm">
                    Password: <span className="font-mono">••••••••</span>
                  </p>
                  {password.url && (
                    <p className="text-sm">
                      URL: <a href={password.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{password.url}</a>
                    </p>
                  )}
                  {password.notes && (
                    <p className="text-sm text-gray-600 mt-2">{password.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))}
            {passwords.length === 0 && (
              <p className="text-center text-gray-500">
                No passwords stored in this group yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordList;