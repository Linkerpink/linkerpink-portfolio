import Image from "next/image";
import Link from "next/link";
import { useTheme } from "./theme-context";

interface GameCardProps {
  href: string;
  imgSrc: string;
  title: string;
  size?: "large" | "medium" | "small";
  technologies?: string[];
  displayDate?: string;
}

const GameCard: React.FC<GameCardProps> = ({
  href,
  imgSrc,
  title,
  size = "small",
  technologies = [],
  displayDate,
}) => {
  const isLarge = size === "large";
  const isMedium = size === "medium";
  const { theme } = useTheme();
  const isSecretTheme = theme === "secret";
  const dateColor = theme === 'dark' ? '#A0A0A0' : theme === 'secret' ? '#a01546' : '#5F5F5F';

  return (
    <div
      className={`horizontal-game ${
        isLarge
          ? "w-full md:w-1/2"
          : isMedium
            ? "w-full sm:w-1/2 md:w-1/3"
            : "w-full sm:w-1/2 md:w-1/4"
      } m-[1%] text-center select-none`}
      style={isSecretTheme ? {
        background: 'radial-gradient(circle at center, #bb00ff, #6aff00)',
        color: '#faecb7',
        borderRadius: '75%',
        border: '4px solid #faecb7',
        fontFamily: 'Smooch, cursive, Arial, sans-serif',
      } : {}}
    >
      <Link
        href={href}
        draggable={false}
        className="no-underline group block interactable-object"
        style={isSecretTheme ? { color: '#faecb7', fontFamily: 'Smooch, cursive, Arial, sans-serif' } : {}}
      >
        {/* Image container */}
        <div className="relative aspect-[16/9] w-full h-[80%]">
          <Image
            src={imgSrc}
            alt={title}
            width={600}
            height={400}
            className="w-full h-full object-cover select-none cursor-pointer"
            draggable={false}
            style={isSecretTheme ? { borderRadius: '75%' } : { borderRadius: '10px' }}
          />

          {/* Technologies badge */}
          {technologies.length > 0 && (
            <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 rounded-md px-0.5 py-0.5 flex gap-0.5 items-center shadow">
              {technologies.map((icon, i) => (
                <Image
                  key={i}
                  src={icon}
                  alt="tech"
                  width={32}
                  height={32}
                  className="w-8.5 h-8.5 object-contain"
                  style={isSecretTheme ? { borderRadius: '75%' } : {}}
                  draggable={false}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      <h2
        className="mt-[10px] text-[1.5em] select-none"
        style={isSecretTheme ? { color: '#faecb7', fontFamily: 'Smooch, cursive, Arial, sans-serif' } : {}}
      >
        {title}
        {displayDate && (
          <div>
            <small className="block text-xs mt-1 select-none" style={{ color: dateColor }}>{displayDate}</small>
          </div>
        )}
      </h2>
    </div>
  );
};
export default GameCard;