import Image from 'next/image';
import { useTheme } from './theme-context';

type SkillCardProps = {
  name: string;
  description: string;
  logo: string;
};

export default function SkillCard({ name, description, logo }: SkillCardProps) {
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
    <div className="w-full md:w-1/2 p-3"> 
      <div className="group">
        <div
          className={`flex items-center p-4 shadow-lg ${gradientClass}`}
          style={isSecretTheme ? {
            borderRadius: '75%',
            fontFamily: 'Smooch, cursive, Arial, sans-serif',
            border: '4px solid #faecb7',
          } : { borderRadius: '10px' }}
        >
          {/* Icon */}
          <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
            {/* Apply theme-aware filters to raster/SVG logos so they match the theme */}
            {(() => {
              const baseStyle: React.CSSProperties = { width: '100%', height: '100%' };
              // Only apply color-changing filters to a small whitelist of SVG logos
              const isSvg = typeof logo === 'string' && logo.toLowerCase().includes('.svg');
              const whitelist = [
                '/next.svg',
                'gamemaker studio logo.svg',
                'gamemaker studio logo',
              ];
              const lowerLogo = typeof logo === 'string' ? logo.toLowerCase() : '';
              const isWhitelisted = isSvg && whitelist.some((w) => lowerLogo.includes(w));
              const themeFilter: React.CSSProperties = isWhitelisted
                ? isDarkTheme
                  ? { filter: 'brightness(0) invert(1)' } // make whitelisted SVG icons light in dark mode
                  : isSecretTheme
                  ? { filter: 'grayscale(100%) sepia(1) saturate(6) hue-rotate(-40deg) contrast(0.95)' } // pinkish tint for secret
                  : {}
                : {};
              const borderStyle: React.CSSProperties = isSecretTheme ? { borderRadius: '75%' } : {};
              const imgStyle = { ...baseStyle, ...themeFilter, ...borderStyle };

              return (
                <Image
                  src={logo}
                  alt={name}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain select-none"
                  draggable={false}
                  style={imgStyle}
                />
              );
            })()}
          </div>

          {/* Text */}
          <div className="ml-6 flex flex-col justify-center">
            <h3
              className="text-lg font-semibold"
              style={isSecretTheme ? { color: '#faecb7', fontFamily: 'Smooch, cursive, Arial, sans-serif' } : {}}
            >
              {name}
            </h3>
            <p
              className="text-sm"
              style={isSecretTheme ? { color: '#faecb7', fontFamily: 'Smooch, cursive, Arial, sans-serif' } : {}}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
