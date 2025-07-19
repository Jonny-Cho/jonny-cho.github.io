import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { getValueFromLocalStorage, setValueToLocalStorage } from '../../utils/localStorage';
import './style.scss';

function ThemeSwitch() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedTheme = getValueFromLocalStorage('isDarkMode');
    if (savedTheme !== undefined) {
      setIsDarkMode(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      setValueToLocalStorage('isDarkMode', isDarkMode);
      document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, isClient]);

  return (
    <div className="dark-mode-button-wrapper flex-center">
      <IconButton className="dark-mode-button rounded-pill" onClick={() => setIsDarkMode((isDark) => !isDark)}>
        {isDarkMode ? (
          <LightModeIcon className="dark-mode-icon" fontSize="large" />
        ) : (
          <DarkModeIcon className="dark-mode-icon" fontSize="large" />
        )}
      </IconButton>
    </div>
  );
}

export default ThemeSwitch;
