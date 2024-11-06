import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import PasswordForm from './PasswordForm';
import { FaPlus, FaMinus, FaEye, FaEyeSlash, FaClipboard } from 'react-icons/fa';
import { Button } from "../ui/button";

const PasswordList = ({ groupId, passwords, onCreatePassword }) => {
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState({});

  const togglePasswordVisibility = (id) => {
    setShowPassword(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Password copied to clipboard');
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
        <Button
          onClick={() => setShowForm(prev => !prev)}
          className="mb-4"
        >
          {showForm ? '-' : '+'} Create Password
        </Button>
        {showForm && <PasswordForm onSubmit={onCreatePassword} />}

        <div className="mt-6 space-y-4">
          {passwords.map(password => (
            <Card key={password.id} className="p-6 bg-gray-100">
              <h3 className="font-bold">{password.title}</h3>
              <p className="text-sm">Username: {password.username}</p>
              <p className="text-sm">
                Password: <span className="pr-2"></span>
                <span className={`font-mono ${showPassword[password.id] ? 'text-red-500' : 'text-black'}`}>
                  {showPassword[password.id] ? password.encrypted_password : '••••••••'}
                </span>
                <button onClick={() => togglePasswordVisibility(password.id)} className="ml-2">
                  {showPassword[password.id] ? <FaEyeSlash /> : <FaEye />}
                </button>
                <button onClick={() => copyToClipboard(password.encrypted_password)} className="ml-2">
                  <FaClipboard />
                </button>
              </p>
              {password.url && (
                <p className="text-sm">
                  URL: <a href={password.url} target="_blank" rel="noopener noreferrer">{password.url}</a>
                </p>
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