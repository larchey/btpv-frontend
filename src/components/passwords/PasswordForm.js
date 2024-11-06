import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { generatePassword } from '../../services/passwords';

const PasswordForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGeneratePassword = async () => {
    try {
      const generatedPassword = await generatePassword();
      setForm(prev => ({
        ...prev,
        password: generatedPassword
      }));
    } catch (error) {
      console.error('Failed to generate password:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      title: '',
      username: '',
      password: '',
      url: '',
      notes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleInputChange}
          required
        />
        <Input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleInputChange}
          required
        />
        <div className="flex gap-2">
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleInputChange}
            required
          />
          <Button
            type="button"
            onClick={handleGeneratePassword}
            className="whitespace-nowrap"
          >
            Generate
          </Button>
        </div>
        <Input
          name="url"
          type="url"
          placeholder="URL"
          value={form.url}
          onChange={handleInputChange}
        />
        <Input
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleInputChange}
        />
      </div>
      <Button type="submit" className="w-full">Add Password</Button>
    </form>
  );
};

export default PasswordForm;