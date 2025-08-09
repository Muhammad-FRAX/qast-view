
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';

const UserManagement: React.FC = () => {
    const { users, createUser } = useAuth();
    const [newUsername, setNewUsername] = useState('');
    const [newRole, setNewRole] = useState<'user' | 'admin'>('user');

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (newUsername.trim()) {
            createUser(newUsername.trim(), newRole);
            setNewUsername('');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">User Management</h1>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New User</CardTitle>
                        <CardDescription>New users will be given a temporary password and forced to change it on first login.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                             <div>
                                <Label htmlFor="new-username">Username</Label>
                                <Input 
                                    id="new-username" 
                                    value={newUsername} 
                                    onChange={e => setNewUsername(e.target.value)}
                                    placeholder="e.g., john.doe"
                                    required
                                />
                             </div>
                             <div>
                                <Label htmlFor="new-role">Role</Label>
                                <Select id="new-role" value={newRole} onChange={e => setNewRole(e.target.value as 'user' | 'admin')}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </Select>
                             </div>
                             <Button type="submit">Create User</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Existing Users</CardTitle>
                         <CardDescription>List of all users in the system.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {users.map(user => (
                                <li key={user.id} className="flex justify-between items-center p-3 bg-secondary/50 rounded-md">
                                    <div>
                                        <p className="font-medium">{user.username}</p>
                                        <p className="text-xs text-muted-foreground">{user.id}</p>
                                    </div>
                                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>{user.role}</Badge>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserManagement;