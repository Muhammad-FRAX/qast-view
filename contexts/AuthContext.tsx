
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';
import toast from 'react-hot-toast';
import { apiFetch, setToken, getToken } from '@/lib/api';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
  users: User[];
  createUser: (username: string, role: 'admin' | 'user', password?: string) => Promise<User | null>;
  changePassword: (userId: string, newPassword: string) => Promise<boolean>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tokenState, setTokenState] = useState<string | null>(getToken());
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users (admin only)
  const fetchUsers = async () => {
    try {
      const data = await apiFetch('/api/users');
      setUsers(data);
    } catch (err) {
      setUsers([]);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const data = await apiFetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }, false);
      setToken(data.token);
      setTokenState(data.token);
      setCurrentUser(data.user);
      toast.success(`Welcome, ${data.user.username}!`);
      return data.user;
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
      return null;
    }
  };

  const logout = () => {
    setToken(null);
    setTokenState(null);
    setCurrentUser(null);
  };

  const createUser = async (username: string, role: 'admin' | 'user', password = 'password') => {
    try {
      const data = await apiFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ username, password, role }),
      });
      toast.success(`User "${username}" created.`);
      fetchUsers();
      return data;
    } catch (err: any) {
      toast.error(err.message || 'User creation failed');
      return null;
    }
  };

  const changePassword = async (userId: string, newPassword: string) => {
    try {
      await apiFetch(`/api/users/${userId}/change-password`, {
        method: 'POST',
        body: JSON.stringify({ newPassword }),
      });
      toast.success('Password changed successfully.');
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Password change failed');
      return false;
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    users,
    createUser,
    changePassword,
    token: tokenState,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};