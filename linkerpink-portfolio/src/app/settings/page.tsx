"use client";
import React from 'react';
import { useTheme } from '../theme-context';

export default function SettingsPage() {

  const { theme, setTheme, secretUnlocked } = useTheme();
  const isSecretTheme = theme === 'secret';
  const isDarkTheme = theme === 'dark';
  let gradientClass = '';
  if (!isSecretTheme) {
    gradientClass = isDarkTheme ? 'card-gradient-dark' : 'card-gradient-light';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-2 sm:px-4">
      <div className="Looking for any other themes? Try entering the konami cheat code for the BEST looking theme EVER!!! (OMG) visibility: hidden"></div>
      <div className={`w-full max-w-3xl sm:w-[90%] rounded-xl shadow-lg p-4 sm:p-12 border border-neutral-200 dark:border-neutral-700 ${gradientClass}`}
        style={isSecretTheme ? {
          borderRadius: '75%',
          background: '#ff16ea',
          color: '#faecb7',
          fontFamily: 'Smooch, cursive, Arial, sans-serif',
          border: '4px solid #faecb7',
        } : { borderRadius: '10px' }}>
        <h1 className="text-3xl font-bold mb-6 text-center">Settings</h1>
        <div className="mb-6">
          <label className="block text-2xl font-bold mb-4 text-center tracking-wide drop-shadow-sm select-none"
            style={isSecretTheme
              ? { color: '#faecb7', fontFamily: 'Smooch, cursive, Arial, sans-serif', textShadow: '0 2px 8px #ff16ea' }
              : { color: isDarkTheme ? '#fafafa' : '#222', fontFamily: 'inherit' }
            }
          >
            Theme
          </label>
          <div className="flex gap-4 justify-center">
            <button
              className={`interactable-object px-8 py-4 text-xl rounded-xl font-semibold border transition-colors duration-200 ${theme === 'light' ? 'bg-[#F57C00] text-white border-[#FFE0B2]' : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600'}`}
              onClick={() => setTheme('light')}
            >
              Light
            </button>
            <button
              className={`interactable-object px-8 py-4 text-xl rounded-xl font-semibold border transition-colors duration-200 ${theme === 'dark' ?  'bg-[#F57C00] text-white border-[#FFE0B2]' : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-white'}`}
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
            <button
              className={`
                interactable-object 
                px-8 
                py-4 
                text-xl 
                rounded-xl 
                font-semibold 
                border
                transition-colors 
                duration-200 
                ${theme === 'secret' ? 'bg-pink-500 text-white border-pink-500' : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600'} ${!secretUnlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => secretUnlocked && setTheme('secret')}
              disabled={!secretUnlocked}
              style={{ display: secretUnlocked ? undefined : 'none' }}
              title={secretUnlocked ? 'Secret theme' : ''}
            >
              Secret
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <button
            className="interactable-object px-8 py-4 text-xl rounded-xl font-semibold border border-red-500 text-red-600 bg-white hover:bg-red-50 transition-colors duration-200 shadow"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all saved data? This cannot be undone.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
          >
            Reset all site data
          </button>
        </div>
        {/* No lock or secret theme hint visible */}
        {/* No tip about secret theme */}
      </div>
    </div>
  );
}
