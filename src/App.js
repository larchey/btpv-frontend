import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import LoginForm from './components/auth/LoginForm';
import GroupList from './components/groups/GroupList';
import PasswordList from './components/passwords/PasswordList';
import { isAuthenticated } from './services/auth';
import { getGroups, createGroup } from './services/groups';
import { getGroupPasswords, createPassword } from './services/passwords';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [passwords, setPasswords] = useState([]);
  const [error, setError] = useState('');

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    fetchGroups();
  };

  const fetchGroups = async () => {
    try {
      const data = await getGroups();
      setGroups(data);
    } catch (err) {
      setError('Failed to fetch groups');
    }
  };

  const handleCreateGroup = async (groupData) => {
    try {
      await createGroup(groupData);
      fetchGroups();
    } catch (err) {
      setError('Failed to create group');
    }
  };

  const handleSelectGroup = async (groupId) => {
    setSelectedGroup(groupId);
    try {
      const data = await getGroupPasswords(groupId);
      setPasswords(data);
    } catch (err) {
      setError('Failed to fetch passwords');
    }
  };

  const handleCreatePassword = async (passwordData) => {
    try {
      await createPassword(passwordData);
      const data = await getGroupPasswords(selectedGroup);
      setPasswords(data);
    } catch (err) {
      setError('Failed to create password');
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      setIsLoggedIn(true);
      fetchGroups();
    }
  }, []);

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GroupList
            groups={groups}
            selectedGroup={selectedGroup}
            onSelectGroup={handleSelectGroup}
            onCreateGroup={handleCreateGroup}
          />
          <PasswordList
            groupId={selectedGroup}
            passwords={passwords}
            onCreatePassword={handleCreatePassword}
          />
        </div>
      </div>
    </div>
  );
};

export default App;