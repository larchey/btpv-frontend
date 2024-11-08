import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "./components/ui/alert";
import { AlertCircle, Users } from 'lucide-react';
import { Button } from "./components/ui/button";
import LoginForm from './components/auth/LoginForm';
import GroupList from './components/groups/GroupList';
import PasswordList from './components/passwords/PasswordList';
import UserManagement from './components/UserManagement';
import { isAuthenticated, logout } from './services/auth';
import { getGroups, createGroup } from './services/groups';
import { getGroupPasswords, createPassword } from './services/passwords';
import { getCurrentUser } from './services/users';
import { setLogoutHandler } from './services/api';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [passwords, setPasswords] = useState([]);
  const [error, setError] = useState('');
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 

  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    await fetchCurrentUser();
    fetchGroups();
    checkAdminStatus();
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setSelectedGroup(null);
    setGroups([]);
    setPasswords([]);
    setIsAdmin(false);
    setCurrentUser(null);  // Clear current user on logout
  };

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error('Failed to fetch current user:', err);
      setError('Failed to fetch user details');
    }
  };

  const checkAdminStatus = async () => {
    try {
      const userData = await getCurrentUser()
      setIsAdmin(userData.is_admin);
    } catch (err) {
      console.error('Failed to check admin status:', err);
    }
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
      fetchCurrentUser(); 
      fetchGroups();
      checkAdminStatus();
    }else{
      handleLogout();
    }

    setLogoutHandler(handleLogout);
    // Clean up when component unmounts
    return () => setLogoutHandler(null);
  }, []);

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">🐢 Password Vault</h1>
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Button
                onClick={() => setShowUserManagement(true)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Users size={18} />
                <span>Manage Users</span>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {showUserManagement && (
        <UserManagement onClose={() => setShowUserManagement(false)} />
      )}

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
            currentUser={currentUser}
            onUpdate={() => {
              fetchGroups();
            }}
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