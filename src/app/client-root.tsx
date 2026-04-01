"use client";

import { ThemeProvider } from "./theme-context";
import Sidebar from "./sidebar";
import EasterEggUnlocker from "./easter-egg-unlocker";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="Looking for any other themes? Try entering the konami cheat code for the BEST looking theme EVER!!! (OMG) visibility: hidden"></div>
      <EasterEggUnlocker />
      <Sidebar />
      <main className="ml-[10.5%]">{children}</main>
    </ThemeProvider>
  );
}
