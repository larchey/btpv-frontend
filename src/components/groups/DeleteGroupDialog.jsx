// src/components/groups/DeleteGroupDialog.jsx
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";

const DeleteGroupDialog = ({ group, onClose, onDelete }) => {
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirmation !== group.name) {
      setError('Group name does not match');
      return;
    }
    onDelete();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={() => onClose()}
    >
      <Card 
        className="w-full max-w-md" 
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle className="text-red-600">Delete Group</CardTitle>
          <CardDescription>
            This action cannot be undone. Please type "{group.name}" to confirm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Input
              type="text"
              placeholder="Type group name to confirm"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="destructive"
                disabled={confirmation !== group.name}
              >
                Delete Group
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteGroupDialog;