"use client";
import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "./theme-context";

export default function KonamiUnlocker() {
  const { secretUnlocked, setSecretUnlocked } = useTheme();
  const [showPopup, setShowPopup] = useState(false);
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  const keyBuffer = useRef<string[]>([]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keyBuffer.current.push(e.key);
      if (keyBuffer.current.length > konamiCode.length) {
        keyBuffer.current.shift();
      }
      if (!secretUnlocked && keyBuffer.current.join(',') === konamiCode.join(',')) {
        setSecretUnlocked(true);
        setShowPopup(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [konamiCode, secretUnlocked, setSecretUnlocked]);


  // Remove auto-close logic; popup will only close on button click

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 pointer-events-auto">
      <div className="bg-pink-600 text-white text-2xl font-bold px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
        <span className="animate-bounce">Secret theme unlocked!</span>
        <button
          className="mt-4 px-6 py-2 rounded-lg bg-white text-pink-600 font-semibold text-lg shadow hover:bg-pink-100 transition-colors"
          onClick={() => setShowPopup(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
