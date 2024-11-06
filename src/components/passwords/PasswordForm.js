import React, { useState } from 'react';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { generatePassword } from '../../services/passwords';

const PasswordForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setForm(prev => ({
      ...prev,
      password: newPassword
    }));
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
    setShowPassword(false);
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
          <div className="relative flex-1">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleInputChange}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Button
            type="button"
            onClick={handleGeneratePassword}
            disabled={isGenerating}
            size="icon"
            variant="outline"
            className="px-3"
          >
            <RefreshCw size={20} className={isGenerating ? 'animate-spin' : ''} />
          </Button>
        </div>
        <Input
          name="url"
          type="url"
          placeholder="URL (optional)"
          value={form.url}
          onChange={handleInputChange}
        />
        <Input
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleInputChange}
        />
      </div>
      <Button type="submit" className="w-full">Add Password</Button>
    </form>
  );
};

export default PasswordForm;