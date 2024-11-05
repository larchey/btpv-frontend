import React, { useState } from 'react';
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { generateSecurePassword } from '../../services/passwords';

const PasswordForm = ({ onSubmit, groupId }) => {
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword();
    setFormData(prev => ({
      ...prev,
      password: newPassword
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      group_id: groupId
    });
    setFormData({
      title: '',
      username: '',
      password: '',
      url: '',
      notes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          title: e.target.value
        }))}
        required
      />
      
      <Input
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          username: e.target.value
        }))}
        required
      />
      
      <div className="flex gap-2">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            password: e.target.value
          }))}
          required
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleGeneratePassword}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <Input
        placeholder="URL"
        type="url"
        value={formData.url}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          url: e.target.value
        }))}
      />
      
      <Input
        placeholder="Notes"
        value={formData.notes}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          notes: e.target.value
        }))}
      />
      
      <Button type="submit" className="w-full">
        Save Password
      </Button>
    </form>
  );
};

export default PasswordForm;