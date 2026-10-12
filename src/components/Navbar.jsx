import React from 'react';
import { Sun, Moon, Menu, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import NotificationPanel from './NotificationPanel';
import Button from './Button';

export const Navbar = ({ pageTitle = 'Dashboard', onToggleMobile, onToggleAI }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button className="btn btn-ghost btn-icon md:hidden" onClick={onToggleMobile}>
          <Menu size={20} />
        </button>
        <h2 className="page-title">{pageTitle}</h2>
      </div>

      <div className="navbar-right">
        <Button variant="secondary" size="sm" icon={Sparkles} onClick={onToggleAI}>
          Ask AI
        </Button>

        <button className="btn btn-ghost btn-icon" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <NotificationPanel notifications={[]} />
      </div>
    </header>
  );
};

export default Navbar;
