// src/components/groups/GroupManagementModal.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, Check, UserMinus, UserPlus } from "lucide-react";
import { addGroupMember, removeGroupMember } from '../../services/groups';
import { getAvailableUsers } from '../../services/groups';
import { Trash2 } from 'lucide-react';
import DeleteGroupDialog from './DeleteGroupDialog';
import { deleteGroup } from '../../services/groups';

const GroupManagementModal = ({ group, onClose, onUpdate }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [groupToDelete, setGroupToDelete] = useState(null);

  const handleDeleteGroup = async () => {
    try {
      await deleteGroup(groupToDelete.id);
      setGroupToDelete(null);
      onClose(); 
      onUpdate?.({ action: 'delete'});  // Pass variable indicating deletion
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };


  const fetchAvailableUsers = async () => {
    try {
      setError('');
      setLoading(true);
      const data = await getAvailableUsers(group.id);
      setAvailableUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to load available users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableUsers();
  }, [group.id]);

  const handleAddMember = async (username) => {
    try {
      setError('');
      await addGroupMember(group.id, username);
      setSuccess(`Added ${username} to the group`);
      onUpdate?.();  // Refresh group data in parent component
      fetchAvailableUsers();  // Refresh available users list
    } catch (err) {
      setError(err.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (username) => {
    try {
      setError('');
      await removeGroupMember(group.id, username);
      setSuccess(`Removed ${username} from the group`);
      onUpdate?.();  // Refresh group data in parent component
      await fetchAvailableUsers();  // Refresh available users list
    } catch (err) {
      setError(err.message || 'Failed to remove member');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-center">

            <div> <CardTitle>Manage Group: {group.name}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-800 hover:bg-red-100 pt-4"
                onClick={() => setGroupToDelete(group)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" onClick={onClose}>Close</Button>

          </div>
          <CardDescription>Add or remove group members</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}

            {/* Available Users */}
            <Card>
              <CardHeader>
                <CardTitle>Available Users</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center">Loading users...</p>
                ) : availableUsers.length === 0 ? (
                  <p className="text-center text-gray-500">No users available to add</p>
                ) : (
                  <div className="space-y-2">
                    {availableUsers.map(user => (
                      <div key={user.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddMember(user.username)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Members */}
            <Card>
              <CardHeader>
                <CardTitle>Current Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {group.members?.map(member => (
                    <div key={member.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">{member.username}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {member.id === group.owner_id ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            Owner
                          </span>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-100"
                            onClick={() => handleRemoveMember(member.username)}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        {/* if delete button clicked */}
        {groupToDelete && (
          <DeleteGroupDialog
            group={groupToDelete}
            onClose={() => setGroupToDelete(null)}
            onDelete={handleDeleteGroup}
          />
        )}
      </Card>
    </div>
  );
};

export default GroupManagementModal;