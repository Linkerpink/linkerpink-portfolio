import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientRoot from "./client-root";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noah's Portfolio",
  description: "The portfolio of Noah (Linkerpink)",
  icons: {
    icon: '/images/linkerpink-icon.png',
    apple: '/images/linkerpink-icon.png',
    other: [
      { rel: 'icon', url: '/images/linkerpink-icon.png', sizes: '32x32' },
      { rel: 'icon', url: '/images/linkerpink-icon.png', sizes: '16x16' },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Pre-hydration theme script */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              var t = localStorage.getItem('theme');
              if (t) {
                document.documentElement.classList.remove('light', 'dark', 'secret');
                document.documentElement.classList.add(t);
              }
            } catch (e) {}
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
