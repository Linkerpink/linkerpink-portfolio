'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './theme-context';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type SidebarItem = {
  href: string;
  img: string;
  alt: string;
  label: string;
  offset?: number;
  last?: boolean;
  external?: boolean;
  anchor?: string;
};

const homepageSidebarItems: SidebarItem[] = [
  { href: '#home', img: '/images/eshop logo.png', alt: 'Home Icon', label: 'Home', offset: -80 },
  { href: '/projects', img: '/images/vandringjorne horror.jpg', alt: 'Projects Icon', label: 'Projects'},
  { href: '#about-me', img: '/images/eng.png', alt: 'My Menu Icon', label: 'Profile', offset: -250 },
  { href: '#skills', img: '/images/c sharp logo.svg', alt: 'Projects Icon', label: 'Skills', offset: 75 },
  { href: '/settings', img: '/images/settings icon.svg', alt: 'Settings Icon', label: 'Settings', last: true},
];

const nonHomepageSidebarItems: SidebarItem[] = [
  { href: '/#home', img: '/images/eshop logo.png', alt: 'Home Icon', label: 'Home', anchor: 'home' },
  { href: '/projects', img: '/images/vandringjorne horror.jpg', alt: 'Projects Icon', label: 'Projects'},
  { href: '/#about-me', img: '/images/eng.png', alt: 'My Menu Icon', label: 'Profile', anchor: 'about-me' },
  { href: '/#skills', img: '/images/itch.io logo.png', alt: 'Projects Icon', label: 'Skills', anchor: 'skills' },
  { href: '/settings', img: '/images/settings icon.svg', alt: 'Settings Icon', label: 'Settings', last: true},
];

export default function Sidebar() {
  const { theme, setTheme, secretUnlocked, setSecretUnlocked } = useTheme();
  const pathname = usePathname();
  const [selectedLabel, setSelectedLabel] = useState('Home');
  const [lastPage, setLastPage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [circleScale, setCircleScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const buttonX = 4 + 32; 
      const buttonY = 4 + 32;

      const distances = [
        Math.hypot(buttonX, buttonY), // top-left corner (button itself)
        Math.hypot(vw - buttonX, buttonY), // top-right
        Math.hypot(buttonX, vh - buttonY), // bottom-left
        Math.hypot(vw - buttonX, vh - buttonY), // bottom-right
      ];
      const maxDistance = Math.max(...distances);

      setCircleScale(maxDistance / 32);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 768 && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  window.addEventListener('resize', handleResize);
  handleResize();

  return () => window.removeEventListener('resize', handleResize);
}, [isMobileMenuOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (pathname !== '/') {
      setLastPage(document.referrer || '/');
    }
  }, [pathname, mounted]);

  useEffect(() => {
    if (!mounted || pathname !== '/' || typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      let currentLabel = 'Home';
      for (const item of homepageSidebarItems) {
        if (!item.href.startsWith('#')) continue;
        const id = item.href.slice(1) || 'home';
        const section = document.getElementById(id);
        const offset = item.offset ?? -80;
        if (section) {
          const offsetTop = section.getBoundingClientRect().top + window.scrollY + offset + 50;
          if (scrollY >= offsetTop) {
            currentLabel = item.label;
          }
        }
      }
      setSelectedLabel(currentLabel);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const anchor = sessionStorage.getItem('scrollToAnchor');
    if (anchor) {
      const el = document.getElementById(anchor);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
      sessionStorage.removeItem('scrollToAnchor');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, mounted]);

  const handleClick = (e: React.MouseEvent, href: string, label: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.slice(1);
      const el = document.getElementById(targetId);
      if (el) {
        const item = homepageSidebarItems.find(i => i.label === label);
        const yOffset = item?.offset ?? -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
    setSelectedLabel(label);
    setIsMobileMenuOpen(false); // close menu after navigation
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = lastPage && lastPage !== window.location.href ? lastPage : '/';
  };

  const sidebarItems = pathname === '/' ? homepageSidebarItems : nonHomepageSidebarItems;

  if (!mounted) return null;

  // Theme-based styles
  const sidebarBg = theme === 'dark'
    ? 'bg-[#232323]'
    : theme === 'secret'
      ? 'bg-gradient-to-b from-[#ffb86f] via-[#ff79c6] to-[#8be9fd]'
      : 'bg-[#E4E4E4]';
  const sidebarText = theme === 'dark'
    ? 'text-[#fafafa]'
    : theme === 'secret'
      ? 'text-[#232323]'
      : 'text-[#3f3f3f]';

  return (
    <>
      {/* Desktop Sidebar */}
  <nav className="hidden md:flex fixed top-0 left-0 h-full flex-col items-center w-[10.5%] bg-transparent z-1000">
        {sidebarItems.map((item, idx) => {
          const isSelected = item.label === selectedLabel;
          const base =
            `sidebar-item w-full py-4 px-0 ${sidebarBg} text-center text-3xl transition-colors duration-150 ${sidebarText} shadow-[5px_0px_5px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center flex-1 border-b-0 border-[#dedede] select-none no-underline cursor-default`;
          const selected = isSelected ? 'text-[#F57C00]' : '';
          const first = idx === 0 ? 'rounded-tr-[35%]' : '';
          // For the last sidebar item (Settings) keep a gradient background but allow hover to change it
          const last = item.last
            ? (theme === 'dark'
                // darker default for dark theme; hover will be lighter
                ? 'rounded-br-[35%] bg-gradient-to-r from-[#070707] to-[#000000] text-[#fafafa]'
                : theme === 'secret'
                  ? 'rounded-br-[35%] bg-gradient-to-r from-[#ffb86f] to-[#ff79c6] text-[#232323]'
                  : // For light (and other) themes use the normal dark gradient to avoid the orange look
                    'rounded-br-[35%] bg-gradient-to-r from-[#545454] to-[#323232] text-[#fafafa]')
            : '';
          
          let hoverBg = '';
          // For the Settings item, only change text color on hover (no background change)
          // Hover: change the background gradient for Settings and other items (only background, not text)
          if (item.label === 'Settings') {
            if (theme === 'dark') {
              hoverBg = 'hover:bg-gradient-to-r hover:from-[#3f3f3f] hover:to-[#232323]';
            } else if (theme === 'secret') {
              hoverBg = 'hover:bg-gradient-to-r hover:from-[#ffd89a] hover:to-[#ff79c6]';
            } else {
              hoverBg = 'hover:bg-gradient-to-r hover:from-[#fff4e6] hover:to-[#ffe0b2]';
            }
          } else {
            if (theme === 'dark') {
              hoverBg = 'hover:bg-[#333845]';
            } else if (theme === 'secret') {
              hoverBg = 'hover:bg-gradient-to-r hover:from-[#ffb86f] hover:to-[#ff79c6]';
            } else {
              hoverBg = 'hover:bg-[#ffe0b2]';
            }
          }

          const hover = `${hoverBg} transition-colors duration-150`;
          const special = item.label === 'Settings' ? ' settings-item' : '';
          const className = [base, selected, first, last, hover, special].join(' ');

          const content = (
            <>
              <Image
                src={item.img}
                alt={item.alt}
                width={64}
                height={64}
                className="w-1/4 h-auto mb-3 pointer-events-none"
                draggable={false}
                priority={idx === 0}
                unoptimized={item.img.startsWith('http')}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/eshop logo.png';
                }}
              />
              <span className="mt-1">{item.label}</span>
            </>
          );

          if (pathname !== '/' && item.label === 'Back') {
            return (
              <a key={item.label} href="#" draggable={false} className={className} onClick={handleBack}>
                {content}
              </a>
            );
          }

          if (item.label === 'Settings') {
            return (
              <a
                key={item.label}
                href={item.href}
                draggable={false}
                className={className}
                onClick={() => setSelectedLabel(item.label)}
              >
                {content}
              </a>
            );
          }

          if (pathname === '/' && item.href.startsWith('#')) {
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleClick(e, item.href, item.label)}
                draggable={false}
                className={className}
              >
                {content}
              </a>
            );
          }

          if (pathname !== '/' && item.anchor) {
            return (
              <a
                key={item.label}
                href={item.href}
                draggable={false}
                className={className}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.anchor) {
                    sessionStorage.setItem('scrollToAnchor', item.anchor);
                  }
                  window.location.href = item.href;
                }}
              >
                {content}
              </a>
            );
          }

          return (
            <a
              key={item.label}
              href={item.href}
              draggable={false}
              className={className}
              onClick={() => setSelectedLabel(item.label)}
            >
              {content}
            </a>
          );
        })}
      </nav>

      {/* Mobile Menu Toggle Button */}
  <div className="fixed top-4 left-4 z-[100] md:hidden isolate">
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`w-16 h-16 rounded-full flex items-center justify-center relative z-[101] ${theme === 'dark' ? 'bg-[#232323]' : theme === 'secret' ? 'bg-gradient-to-b from-[#ffb86f] via-[#ff79c6] to-[#8be9fd]' : 'bg-white'}`}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          animate={{
            boxShadow: isMobileMenuOpen
              ? '0px 0px 0px rgba(0, 0, 0, 0)'
              : '0px 4px 2.5px rgba(0, 0, 0, 0.35)'
          }}
        >
          {isMobileMenuOpen ? (
            <motion.span
              key="close-icon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-3xl select-none"
            >
              <Image
                src="/images/close icon.svg"
                alt="Menu"
                width={32}
                height={32}
                className="pointer-events-none"
              />
            </motion.span>
          ) : (
            <motion.div
              key="open-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/images/hambureger menu icon.svg"
                alt="Menu"
                width={32}
                height={32}
                className="pointer-events-none"
              />
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Expanding Circle Background */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              key="circle-bg"
              initial={{ scale: 1 }}
              animate={{ scale: circleScale}}
              exit={{ scale: 1 }}
              transition={{ duration: 0.5, ease: [0.4, 0.25, 0.1, 1] }}
              className={`fixed top-4 left-4 w-16 h-16 rounded-full z-50 origin-center ${theme === 'dark' ? 'bg-[#232323]' : theme === 'secret' ? 'bg-gradient-to-b from-[#ffb86f] via-[#ff79c6] to-[#8be9fd]' : 'bg-white'}`}
              style={{ transformOrigin: 'middle center' }}
            />

            {/* Mobile Fullscreen Menu */}
            <motion.nav
              key="mobile-menu"
              initial={{ opacity: 0, scale: '0%', x: '-80%', y: '-80%' }}
              animate={{ opacity: 1, scale: '150%', x: 0, y: 0 }}
              exit={{ opacity: 0, scale: '0%', x: '-80%', y: '-80%'  }}
              transition={{duration: 0.5, ease: [0.4, 0.25, 0.1, 1], delay: 0.05}}
              className={`fixed inset-0 z-50 flex flex-col items-center justify-center md:hidden space-y-6 ${sidebarBg}`}
            >
              {sidebarItems.map((item) => {
                const isSelected = item.label === selectedLabel;
                return (
                  <a
                    key={item.label}
                    href={item.href.startsWith('#') ? item.href : item.href}
                    draggable={false}
                    onClick={(e) => {
                      if (item.label === 'Back' && pathname !== '/') {
                        handleBack(e);
                      } else if (pathname === '/' && item.href.startsWith('#')) {
                        handleClick(e, item.href, item.label);
                      } else {
                        setSelectedLabel(item.label);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className={`text-2xl font-semibold ${isSelected ? 'text-[#F57C00]' : sidebarText}`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
