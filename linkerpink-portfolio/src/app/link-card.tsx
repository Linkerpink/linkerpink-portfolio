import Image from 'next/image';
import { useTheme } from './theme-context';

type LinkCardProps = {
  logo: string;
  href: string;
};

export default function LinkCard({ logo, href }: LinkCardProps) {
  const { theme } = useTheme();
  const isSecretTheme = theme === 'secret';
  const isDarkTheme = theme === 'dark';

  let gradientClass = '';
  if (!isSecretTheme) {
    gradientClass = isDarkTheme ? 'card-gradient-dark' : 'card-gradient-light';
  }
  else {
    gradientClass = 'card-gradient-secret';
  }

  return (
    <div className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 p-2 sm:p-3">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block group interactable-object"
        draggable={false}
        style={
          isSecretTheme
            ? {
                color: '#faecb7',
                fontFamily: 'Smooch, cursive, Arial, sans-serif',
              }
            : {}
        }
      >
        <div
          className={`aspect-[1/1] flex items-center justify-center p-3 sm:p-4 shadow-md sm:shadow-lg cursor-pointer transition-all duration-200 ${gradientClass}`}
          style={
            isSecretTheme
              ? {
                  borderRadius: '75%',
                  fontFamily: 'Smooch, cursive, Arial, sans-serif',
                  border: '3px solid #faecb7',
                }
              : { borderRadius: '10px' }
          }
        >
          <div className="w-2/2 h-2/2 flex items-center justify-center overflow-hidden relative">
            <Image
              src={logo}
              alt=""
              width={64}
              height={64}
              className="w-full h-full object-contain select-none"
              draggable={false}
              style={isSecretTheme ? { borderRadius: '75%' } : {}}
            />
            {/* Apply theme-aware filters to SVG logos (GitHub, etc.) */}
            {(() => {
              const isSvg = typeof logo === 'string' && logo.toLowerCase().includes('.svg');
              if (!isSvg) return null;
              const baseStyle: React.CSSProperties = { width: '100%', height: '100%' };
              const themeFilter: React.CSSProperties = isDarkTheme
                ? { filter: 'brightness(0) invert(1)' }
                : isSecretTheme
                ? { filter: 'grayscale(100%) sepia(1) saturate(6) hue-rotate(-40deg) contrast(0.95)' }
                : {};
              const borderStyle: React.CSSProperties = isSecretTheme ? { borderRadius: '75%' } : {};
              const imgStyle = { ...baseStyle, ...themeFilter, ...borderStyle };
              return (
                <Image
                  src={logo}
                  alt=""
                  width={64}
                  height={64}
                  className="w-full h-full object-contain select-none absolute"
                  draggable={false}
                  style={imgStyle}
                />
              );
            })()}
          </div>
        </div>
      </a>
    </div>
  );
}
