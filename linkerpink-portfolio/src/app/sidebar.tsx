'use client';
import { useState, useEffect } from 'react';
import { useTheme } from './theme-context';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const GAME_ICONS_POOL = [
  "/images/game icons/robo rebellion icon.webp",
  "/images/game icons/bpm icon.webp",
  "/images/game icons/when time collides icon.webp",
  "/images/game icons/shy icon.webp",
  "/images/game icons/slimetastic punchout icon.webp",
  "/images/game icons/shmup 2 icon.webp",
  "/images/game icons/not not balatro icon.webp",
];

const SECRET_GAME_ICONS_POOL = [
  "/images/game icons/robo rebellion icon.webp",
  "/images/game icons/bpm icon.webp",
  "/images/game icons/when time collides icon.webp",
  "/images/game icons/shy icon.webp",
  "/images/game icons/slimetastic punchout icon.webp",
  "/images/game icons/shmup 2 icon.webp",
  "/images/game icons/not not balatro icon.webp",
];

const SECRET_ICON_MAP: Record<string, string> = {
  'Home': '/images/home icon secret.webp',
  'Projects': '/images/secret/projects-secret.jpg',
  'Profile': '/images/linkerpink-icon-secret.png',
  'Skills': '/images/eng.png',
  'Settings': '/images/eng.png',
};

type SidebarItem = {
  href: string;
  img: string;
  alt: string;
  label: string;
  offset?: number;
  last?: boolean;
  external?: boolean;
  anchor?: string;
  iconSize?: string;
  hoverScale?: number;
  hoverRotate?: number;
  hoverY?: number;
  isStack?: boolean;
};

const homepageSidebarItems: SidebarItem[] = [
  { href: '#home', img: '/images/eshop logo.png', alt: 'Home Icon', label: 'Home', iconSize: 'w-1/3', hoverScale: 1.1 },
  {
    href: '/projects',
    img: '/images/game icons/bpm icon.webp',
    alt: 'Projects Icon',
    label: 'Projects',
    isStack: true,
    iconSize: 'w-[40%]'
  },
  { href: '#about-me', img: '/images/linkerpink-icon.webp', alt: 'My Menu Icon', label: 'Profile', iconSize: 'w-1/2', hoverY: -10, hoverScale: 1.05 },
  { href: '#skills', img: '/images/c sharp logo.svg', alt: 'Projects Icon', label: 'Skills', iconSize: 'w-[30%]', hoverRotate: 15, hoverScale: 1.15 },
  { href: '/settings', img: '/images/settings icon new.webp', alt: 'Settings Icon', label: 'Settings', last: true, iconSize: 'w-1/3', hoverRotate: 15, hoverScale: 1.25 },
];

const nonHomepageSidebarItems: SidebarItem[] = [
  { href: '/#home', img: '/images/eshop logo.png', alt: 'Home Icon', label: 'Home', anchor: 'home', iconSize: 'w-1/3', hoverScale: 1.1 },
  { href: '/projects', img: '/images/game icons/bpm icon.webp', alt: 'Projects Icon', label: 'Projects', isStack: true, iconSize: 'w-[40%]' },
  { href: '/#about-me', img: '/images/linkerpink-icon.webp', alt: 'My Menu Icon', label: 'Profile', anchor: 'about-me', iconSize: 'w-1/2', hoverY: -10, hoverScale: 1.05 },
  { href: '/#skills', img: '/images/c sharp logo.svg', alt: 'Projects Icon', label: 'Skills', anchor: 'skills', iconSize: 'w-[30%]', hoverRotate: 15, hoverScale: 1.15 },
  { href: '/settings', img: '/images/settings icon new.webp', alt: 'Settings Icon', label: 'Settings', last: true, iconSize: 'w-1/3', hoverRotate: 15, hoverScale: 1.25 },
];

const WIIU_DROP_SHADOW_STYLE = {
  filter: 'drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.4))',
};

export default function Sidebar() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [selectedLabel, setSelectedLabel] = useState('Home');
  const [lastPage, setLastPage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [circleScale, setCircleScale] = useState(1);
  const [projectStackIcons, setProjectStackIcons] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);

      const poolSource = theme === 'secret' ? SECRET_GAME_ICONS_POOL : GAME_ICONS_POOL;
      const pool = poolSource.length > 0 ? [...poolSource] : ['/images/game icons/bpm icon.webp'];

    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const selected = [];
    for (let i = 0; i < 3; i++) {
      selected.push(pool[i % pool.length]);
    }

    setProjectStackIcons(selected);
  }, [theme]);

  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const buttonX = 64;
      const buttonY = 64;

      const distances = [
        Math.hypot(buttonX, buttonY),
        Math.hypot(vw - buttonX, buttonY),
        Math.hypot(buttonX, vh - buttonY),
        Math.hypot(vw - buttonX, vh - buttonY),
      ];
      setCircleScale(Math.max(...distances) / 32);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!mounted) return;
    if (pathname !== '/') setLastPage(document.referrer || '/');
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
          if (scrollY >= offsetTop) currentLabel = item.label;
        }
      }
      setSelectedLabel(currentLabel);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    const anchor = sessionStorage.getItem('scrollToAnchor');
    if (anchor) {
      const el = document.getElementById(anchor);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
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
    setIsMobileMenuOpen(false);
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = lastPage && lastPage !== window.location.href ? lastPage : '/';
  };

  const singleIconVariants: Variants = {
    rest: { scale: 1, rotate: 0, y: 0 },
    hover: { transition: { type: 'spring', stiffness: 300, damping: 15 } }
  };

  const getStackItemVariants = (index: number): Variants => {
    const rotate = index === 0 ? -12 : index === 1 ? 8 : -4;
    const liftY = index === 0 ? -18 : index === 1 ? -10 : -2;
    const shiftX = index === 0 ? -5 : index === 1 ? 5 : 0;
    const scale = index === 0 ? 1.1 : index === 1 ? 1.05 : 1.02;
    const zIndex = 10 - index;

    return {
      rest: {
        rotate: index * 3 - 3,
        y: index * 2,
        x: 0,
        scale: 1,
        zIndex: zIndex,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      },
      hover: {
        rotate: rotate,
        y: liftY,
        x: shiftX,
        scale: scale,
        zIndex: zIndex,
        transition: { type: 'spring', stiffness: 200, damping: 15, delay: index * 0.05 }
      }
    }
  };

  if (!mounted) return null;

  const sidebarItems = pathname === '/' ? homepageSidebarItems : nonHomepageSidebarItems;

  const sidebarBg = theme === 'dark'
    ? 'bg-[#232323]'
    : theme === 'secret'
      ? 'bg-gradient-to-b from-[#ffb86f] via-[#ff79c6] to-[#8be9fd]'
      : 'bg-white';
  const sidebarText = theme === 'dark'
    ? 'text-[#fafafa]'
    : theme === 'secret'
      ? 'text-[#232323]'
      : 'text-[#3f3f3f]';

  const stackStyles = theme === 'dark'
    ? 'border-white/10 bg-[#333]'
    : theme === 'secret'
      ? 'border-[#ff79c6]/40 bg-white/40'
      : 'border-black/10 bg-white';

  return (
    <>
      <nav className="hidden md:flex fixed top-0 left-0 h-full flex-col items-center w-[10.5%] bg-transparent z-1000">
        {sidebarItems.map((item, idx) => {
          const isSelected = item.label === selectedLabel;
          const base = `sidebar-item w-full py-4 px-0 ${sidebarBg} text-center text-3xl transition-colors duration-150 ${sidebarText} shadow-[5px_0px_5px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center flex-1 border-b-0 border-[#dedede] select-none no-underline cursor-default`;
          const selected = isSelected ? 'text-[#F57C00]' : '';
          const first = idx === 0 ? 'rounded-tr-[35%]' : '';
          const last = item.last
            ? (theme === 'dark'
              ? 'rounded-br-[35%] bg-gradient-to-r from-[#070707] to-[#000000] text-[#fafafa]'
              : theme === 'secret'
                ? 'rounded-br-[35%] bg-gradient-to-r from-[#ffb86f] to-[#ff79c6] text-[#232323]'
                : 'rounded-br-[35%] bg-gradient-to-r from-[#545454] to-[#323232] text-[#fafafa]')
            : '';

          let hoverBg = '';
          if (item.label === 'Settings') {
            hoverBg = theme === 'dark' ? 'hover:bg-gradient-to-r hover:from-[#3f3f3f] hover:to-[#232323]'
              : theme === 'secret' ? 'hover:bg-gradient-to-r hover:from-[#ffd89a] hover:to-[#ff79c6]'
                : 'hover:bg-gradient-to-r hover:from-[#fff4e6] hover:to-[#ffe0b2]';
          } else {
            hoverBg = theme === 'dark' ? 'hover:bg-[#333845]'
              : theme === 'secret' ? 'hover:bg-gradient-to-r hover:from-[#ffb86f] hover:to-[#ff79c6]'
                : 'hover:bg-[#ffe0b2]';
          }

          const className = [base, selected, first, last, hoverBg, 'transition-colors duration-150', item.label === 'Settings' ? 'settings-item' : ''].join(' ');

          let iconContent;
          if (item.isStack && projectStackIcons.length > 0) {
            iconContent = (
              <motion.div className={`${item.iconSize || 'w-1/3'} h-auto mb-3 pointer-events-none relative flex justify-center items-center aspect-square`}>
                {projectStackIcons.slice(0, 3).map((iconSrc, stackIdx) => (
                  <motion.div
                    key={`${item.label}-stack-${stackIdx}`}
                    className={`absolute w-full h-full rounded-2xl overflow-hidden backdrop-blur-sm border ${stackStyles}`}
                    variants={getStackItemVariants(stackIdx)}
                  >
                    <Image
                      src={iconSrc}
                      alt={`${item.alt} stack ${stackIdx}`}
                      width={128}
                      height={128}
                      className="w-full h-full object-contain p-2 rounded-2xl"
                      style={WIIU_DROP_SHADOW_STYLE}
                      draggable={false}
                      unoptimized={iconSrc.startsWith('http')}
                    />
                  </motion.div>
                ))}
              </motion.div>
            );
          } else {
            const specificVariants = {
              ...singleIconVariants,
              hover: { ...singleIconVariants.hover, scale: item.hoverScale ?? 1, rotate: item.hoverRotate ?? 0, y: item.hoverY ?? 0 }
            }
            iconContent = (
              <motion.div className={`${item.iconSize || 'w-1/3'} h-auto mb-3 pointer-events-none relative flex justify-center`} variants={specificVariants}>
                <Image
                  src={(theme === 'secret' && SECRET_ICON_MAP[item.label]) ? SECRET_ICON_MAP[item.label] : item.img}
                  alt={item.alt}
                  width={128}
                  height={128}
                  className="w-full h-auto"
                  style={WIIU_DROP_SHADOW_STYLE}
                  draggable={false}
                  priority={idx === 0}
                  unoptimized={item.img.startsWith('http')}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/eshop logo.png'; }}
                />
              </motion.div>
            );
          }

          const finalContent = <>{iconContent}<span className="mt-1">{item.label}</span></>;
          const motionProps = { initial: "rest", whileHover: "hover", animate: "rest", className: className, draggable: false };

          if (pathname !== '/' && item.label === 'Back') {
            return <motion.a {...motionProps} key={item.label} href="#" onClick={handleBack}>{finalContent}</motion.a>;
          }
          if (item.label === 'Settings') {
            return <motion.a {...motionProps} key={item.label} href={item.href} onClick={() => setSelectedLabel(item.label)}>{finalContent}</motion.a>;
          }
          if (pathname === '/' && item.href.startsWith('#')) {
            return <motion.a {...motionProps} key={item.label} href={item.href} onClick={(e) => handleClick(e, item.href, item.label)}>{finalContent}</motion.a>;
          }
          if (pathname !== '/' && item.anchor) {
            return <motion.a {...motionProps} key={item.label} href={item.href} onClick={(e) => { e.preventDefault(); if (item.anchor) sessionStorage.setItem('scrollToAnchor', item.anchor); window.location.href = item.href; }}>{finalContent}</motion.a>;
          }
          return <motion.a {...motionProps} key={item.label} href={item.href} onClick={() => setSelectedLabel(item.label)}>{finalContent}</motion.a>;
        })}
      </nav>

      <div className="fixed top-4 left-4 z-[100] md:hidden isolate">
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`w-16 h-16 rounded-full flex items-center justify-center relative z-[101] ${theme === 'dark' ? 'bg-[#232323]' : theme === 'secret' ? 'bg-gradient-to-b from-[#ffb86f] via-[#ff79c6] to-[#8be9fd]' : 'bg-white'}`}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          animate={{ boxShadow: isMobileMenuOpen ? '0px 0px 0px rgba(0, 0, 0, 0)' : '0px 4px 2.5px rgba(0, 0, 0, 0.35)' }}
        >
          {isMobileMenuOpen ? (
            <motion.span key="close-icon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="text-3xl select-none">
              <Image src="/images/close icon.svg" alt="Menu" width={32} height={32} className={`pointer-events-none ${theme === 'dark' ? 'invert' : theme === 'secret' ? 'invert-0' : 'invert-0'}`} />
            </motion.span>
          ) : (
            <motion.div key="open-icon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Image src="/images/hambureger menu icon.svg" alt="Menu" width={32} height={32} className={`pointer-events-none ${theme === 'dark' ? 'invert' : theme === 'secret' ? 'invert-0' : 'invert-0'}`} />
            </motion.div>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div key="circle-bg" initial={{ scale: 1 }} animate={{ scale: circleScale }} exit={{ scale: 1 }} transition={{ duration: 0.5, ease: [0.4, 0.25, 0.1, 1] }} className={`fixed top-4 left-4 w-16 h-16 rounded-full z-50 origin-center ${sidebarBg}`} style={{ transformOrigin: 'middle center' }} />
            <motion.nav key="mobile-menu" initial={{ opacity: 0, scale: '0%', x: '-80%', y: '-80%' }} animate={{ opacity: 1, scale: '150%', x: 0, y: 0 }} exit={{ opacity: 0, scale: '0%', x: '-80%', y: '-80%' }} transition={{ duration: 0.5, ease: [0.4, 0.25, 0.1, 1], delay: 0.05 }} className={`fixed inset-0 z-50 flex flex-col items-center justify-center md:hidden space-y-6 ${sidebarBg}`}>
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