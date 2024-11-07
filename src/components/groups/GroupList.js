// src/components/groups/GroupList.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Users } from 'lucide-react';
import GroupManagementModal from './GroupManagementModal';

const GroupList = ({ 
  groups, 
  selectedGroup, 
  onSelectGroup, 
  onCreateGroup,
  currentUser  
}) => {
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [managingGroup, setManagingGroup] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreateGroup(newGroup);
    setNewGroup({ name: '', description: '' });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Groups</CardTitle>
        </CardHeader>
        <CardContent>
        <Button
          onClick={() => setShowForm(prev => !prev)}
          className="mb-4"
        >
          {showForm ? '-' : '+'} Create Group
        </Button>
        {showForm && <form onSubmit={handleSubmit} className="mb-4 space-y-4 pb-14">
            <div className="space-y-2 ">
              <Input
                placeholder="Group Name"
                value={newGroup.name}
                onChange={(e) => setNewGroup(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
              />
              <Input
                placeholder="Description"
                value={newGroup.description}
                onChange={(e) => setNewGroup(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
              />
            </div>
            <Button type="submit" className="w-full">Create Group</Button>
          </form>}

          <div className="space-y-2">
            {groups.map(group => (
              <div key={group.id} className="flex gap-2">
                <Button
                  variant={selectedGroup === group.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => onSelectGroup(group.id)}
                >
                  {group.name}
                </Button>
                {group.owner_id === currentUser?.id && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setManagingGroup(group)}
                  >
                    <Users className="h-4 w-14" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {managingGroup && (
        <GroupManagementModal
          group={managingGroup}
          onClose={() => setManagingGroup(null)}
          onUpdate={() => {
            // Refresh groups data
            onCreateGroup(); // This should fetch groups again
            setManagingGroup(null);
          }}
        />
      )}
    </>
  );
};

export default GroupList;