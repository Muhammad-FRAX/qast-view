
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

export default function Sidebar({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-card border-r border-border shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <span
            className={cn(
              'text-2xl font-bold text-primary whitespace-nowrap overflow-hidden transition-all',
              expanded ? 'w-32' : 'w-0'
            )}
          >
            QastView
          </span>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-secondary dark:hover:bg-muted"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>
        
        <div className="border-t flex p-3">
             <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                {currentUser?.username.charAt(0).toUpperCase()}
            </div>
            <div
                className={cn(
                'flex justify-between items-center overflow-hidden transition-all',
                expanded ? 'w-52 ml-3' : 'w-0'
                )}
            >
                <div className="leading-4">
                <h4 className="font-semibold">{currentUser?.username}</h4>
                <span className="text-xs text-gray-600 dark:text-gray-400">{currentUser?.role}</span>
                </div>
            </div>
        </div>
      </nav>
    </aside>
  );
}

interface SidebarItemProps {
  icon: React.ReactElement;
  text: string;
  active?: boolean;
  alert?: boolean;
  to?: string;
}

export function SidebarItem({ icon, text, to }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);
  
  const commonClasses =
    'relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group';

  const content = (
    <>
      {icon}
      <span
        className={cn(
          'overflow-hidden transition-all',
          expanded ? 'w-52 ml-3' : 'w-0'
        )}
      >
        {text}
      </span>
      
      {!expanded && (
        <div
          className="absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
        >
          {text}
        </div>
      )}
    </>
  );

  const activeClasses = 'bg-indigo-100 text-indigo-900 dark:bg-muted dark:text-primary';
  const inactiveClasses = 'hover:bg-indigo-50 dark:hover:bg-muted text-gray-600 dark:text-gray-400';

  if (to) {
    return (
      <li>
        <NavLink
            to={to}
            end
            className={({ isActive }) =>
            cn(
                commonClasses,
                isActive ? activeClasses : inactiveClasses
            )
            }
        >
            {content}
        </NavLink>
      </li>
    );
  }

  return (
    <li
      className={cn(
        commonClasses,
        inactiveClasses
      )}
    >
      {content}
    </li>
  );
}