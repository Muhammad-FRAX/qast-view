
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import toast from 'react-hot-toast';

const ChangePassword = () => {
    const { currentUser, changePassword } = useAuth();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    if (!currentUser || !currentUser.requiresPasswordChange) {
        navigate('/');
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        const success = changePassword(currentUser.id, newPassword);
        if (success) {
            toast.success("Password changed successfully! You can now access the app.");
            navigate('/');
        } else {
            toast.error("Failed to change password.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary/30">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Change Your Password</CardTitle>
                    <CardDescription>For security, you must change your temporary password before you can continue.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Set Password and Continue</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default ChangePassword;