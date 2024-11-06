import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "./components/ui/alert";
import { AlertCircle } from 'lucide-react';
import LoginForm from './components/auth/LoginForm';
import GroupList from './components/groups/GroupList';
import PasswordList from './components/passwords/PasswordList';
import { isAuthenticated, logout } from './services/auth';
import { getGroups, createGroup } from './services/groups';
import { getGroupPasswords, createPassword, generatePassword } from './services/passwords';

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

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setSelectedGroup(null);
    setGroups([]);
    setPasswords([]);
  };

  const fetchGroups = async () => {
    try {
      setError('');
      const data = await getGroups();
      setGroups(data);
    } catch (err) {
      if (err.message.includes('expired')) {
        handleLogout();
      } else {
        setError('Failed to fetch groups: ' + err.message);
      }
    }
  };

  const handleCreateGroup = async (groupData) => {
    try {
      setError('');
      await createGroup(groupData);
      await fetchGroups();
    } catch (err) {
      setError('Failed to create group: ' + err.message);
    }
  };

  const handleSelectGroup = async (groupId) => {
    try {
      setError('');
      setSelectedGroup(groupId);
      const data = await getGroupPasswords(groupId);
      setPasswords(data);
    } catch (err) {
      setError('Failed to fetch passwords: ' + err.message);
    }
  };

  const handleCreatePassword = async (passwordData) => {
    try {
      setError('');
      if (!selectedGroup) {
        setError('Please select a group first');
        return;
      }
      
      // Add group_id to password data
      const fullPasswordData = {
        ...passwordData,
        url: passwordData.url === '' ? null : passwordData.url,
        encryption_key: "",
        encypted_password: "",
        group_id: selectedGroup
      };

      // Create the password
      await createPassword(fullPasswordData);
      
      // Refresh the password list
      const updatedPasswords = await getGroupPasswords(selectedGroup);
      setPasswords(updatedPasswords);
    } catch (err) {
      setError('Failed to create password: ' + err.message);
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
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Password Vault</h1>
          <button 
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
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