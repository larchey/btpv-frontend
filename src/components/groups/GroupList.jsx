// src/components/groups/GroupList.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const GroupList = ({ 
  groups, 
  selectedGroup, 
  onSelectGroup, 
  onCreateGroup 
}) => {
  const [newGroup, setNewGroup] = React.useState({ name: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreateGroup(newGroup);
    setNewGroup({ name: '', description: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Groups</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="mb-4 space-y-4">
          <div className="space-y-2">
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
        </form>

        <div className="space-y-2">
          {groups.map(group => (
            <Button
              key={group.id}
              variant={selectedGroup === group.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onSelectGroup(group.id)}
            >
              {group.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupList;