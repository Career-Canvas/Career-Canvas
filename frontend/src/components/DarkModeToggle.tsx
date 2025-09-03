import React from 'react';
import DarkModeToggle from 'react-dark-mode-toggle';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDark, toggle } = useTheme();

  return (
    <div className="flex items-center justify-center">
      <DarkModeToggle
        onChange={toggle}
        checked={isDark}
        size={60}
        speed={1.5}
        className="dark-mode-toggle"
      />
    </div>
  );
};

export default ThemeToggle;
