import React, { useEffect } from 'react';
import { Dashboard } from './Dashboard';
import { useExtensionStorage } from '../hooks/useExtensionStorage';

const Popup: React.FC = () => {
  const { settings } = useExtensionStorage();

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System mode
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  return (
    <div className="w-[380px] p-4 font-sans text-warm-900 dark:text-warm-50 bg-warm-50 dark:bg-warm-900">
      <Dashboard />
    </div>
  );
};

export default Popup;
