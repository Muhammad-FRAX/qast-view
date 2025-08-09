
import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 shrink-0">
      <div>
        {/* Can add breadcrumbs or page title here */}
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                {currentUser?.username.charAt(0).toUpperCase()}
            </div>
            <div>
                <p className="text-sm font-medium">{currentUser?.username}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
            </div>
        </div>
         <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;