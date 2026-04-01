"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from './theme-context';

declare global {
  interface Window {
    __secretPopupShown?: boolean;
  }
}

export default function SettingsMenu() {
  const { theme, setTheme, secretUnlocked, setSecretUnlocked } = useTheme();
  const [showSecretPopup, setShowSecretPopup] = useState(false);
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  const keyBuffer = useRef<string[]>([]);

  useEffect(() => {
    if (
      showSecretPopup &&
      secretUnlocked &&
      !window.__secretPopupShown
    ) {
      window.__secretPopupShown = true;
    } else if (!showSecretPopup) {
      window.__secretPopupShown = false;
    }
  }, [showSecretPopup, secretUnlocked]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keyBuffer.current.push(e.key);
      if (keyBuffer.current.length > konamiCode.length) {
        keyBuffer.current.shift();
      }
      if (
        keyBuffer.current.join(',') === konamiCode.join(',') &&
        !secretUnlocked &&
        !window.__secretPopupShown
      ) {
        setSecretUnlocked(true);
        setShowSecretPopup(true);
        window.__secretPopupShown = true;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [konamiCode, secretUnlocked, setSecretUnlocked]);

  const isSecretTheme = theme === 'secret';
  const isDarkTheme = theme === 'dark';
  let gradientClass = '';
  if (!isSecretTheme) {
    gradientClass = isDarkTheme ? 'card-gradient-dark' : 'card-gradient-light';
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${gradientClass}`}
      style={isSecretTheme ? {
        borderRadius: '75%',
        fontFamily: 'Smooch, cursive, Arial, sans-serif',
        border: '4px solid #faecb7',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      } : {
        borderRadius: '10px',
        fontFamily: 'inherit',
        border: isDarkTheme ? '1.5px solid #444' : '1.5px solid #e0e0e0',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.17)',
      }}>
      {showSecretPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-sm">
          <div className={`bg-yellow-300 text-black rounded font-bold p-6 shadow-lg flex flex-col items-center ${gradientClass}`}
            style={isSecretTheme ? {
              borderRadius: '75%',
              background: '#ff16ea',
              color: '#faecb7',
              fontFamily: 'Smooch, cursive, Arial, sans-serif',
              border: '4px solid #faecb7',
            } : { borderRadius: '10px' }}>
            <span className="text-2xl mb-4">🎉 You unlocked BEST THEME EVER!! 🎉</span>
            <button
              className="mt-2 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
              onClick={() => setShowSecretPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <h2 className="font-bold mb-2">Settings</h2>
      <div className="flex items-center gap-2">
        <span>Theme:</span>
        <button
          className={`px-2 py-1 rounded ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={() => setTheme('light')}
        >
          Light
        </button>
        <button
          className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          onClick={() => setTheme('dark')}
        >
          Dark
        </button>
        {secretUnlocked && (
          <button
            className={`px-2 py-1 rounded ${theme === 'secret' ? 'bg-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            onClick={() => setTheme('secret')}
          >
            BEST THEME EVER!!
          </button>
        )}
      </div>
      {secretUnlocked && (
        <div className="mt-2 text-xs text-gray-500">To reset for testing: <b>localStorage.removeItem(&apos;secretUnlocked&apos;)</b> in your browser console.</div>
      )}
    </div>
  );
}
