import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../theme-context";

interface MediaCardProps {
  title: string;
  size?: "large" | "medium" | "small";
  imgSrc?: string;
  gifSrc?: string;
  videoSrc?: string;
  youtubeId?: string;
  onClick?: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({
  title,
  size = "small",
  imgSrc,
  gifSrc,
  videoSrc,
  youtubeId,
  onClick,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isLarge = size === "large";
  const isMedium = size === "medium";
  const { theme } = useTheme();
  const isSecretTheme = theme === "secret";

  const widthClass = isLarge
    ? "w-full md:w-1/2"
    : isMedium
    ? "w-full sm:w-1/2 md:w-1/3"
    : "w-full sm:w-1/2 md:w-1/4";

  // Only show an overlay icon for images/gifs (zoom). Do not show
  // an icon for video files or YouTube embeds per design request.
  let iconSrc: string | null = null;
  if (imgSrc || gifSrc) iconSrc = "/images/zoom icon.webp";

  const handleClick = () => {
    if (imgSrc || gifSrc) {
      setIsFullscreen(true);
    } else if (onClick) {
      onClick();
    }
  };

  // Close on Escape key
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  return (
    <>
      <div
        className={`horizontal-game ${widthClass} m-1 text-center select-none`}
        style={
          isSecretTheme
            ? {
                background: "radial-gradient(circle at center, #bb00ff, #6aff00)",
                color: "#faecb7",
                borderRadius: "75%",
                border: "4px solid #faecb7",
                fontFamily: "Smooch, cursive, Arial, sans-serif",
              }
            : {}
        }
      >
        <div
          onClick={handleClick}
          className="relative aspect-[16/9] w-full rounded-lg overflow-hidden interactable-object hover:cursor-pointer"
          style={isSecretTheme ? { borderRadius: "75%" } : { borderRadius: "10px" }}
        >
          {imgSrc && (
            <Image
              src={imgSrc}
              alt={title}
              width={600}
              height={400}
              className="w-full h-full object-cover"
              draggable={false}
              style={isSecretTheme ? { borderRadius: "75%" } : {}}
            />
          )}

          {gifSrc && (
            <img
              src={gifSrc}
              alt={title}
              className="w-full h-full object-cover"
              draggable={false}
              style={isSecretTheme ? { borderRadius: "75%" } : { borderRadius: "10px" }}
            />
          )}

          {videoSrc && (
            <video
              src={videoSrc}
              controls
              className="w-full h-full object-cover"
              style={isSecretTheme ? { borderRadius: "75%" } : {}}
            />
          )}

          {youtubeId && (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              allowFullScreen
              className="w-full h-full object-cover"
              style={isSecretTheme ? { borderRadius: "75%" } : {}}
            />
          )}

          {iconSrc && (
            <div className="absolute bottom-0 right-0 rounded-md items-center w-12 h-12">
              <Image
                src={iconSrc}
                alt="media type"
                fill
                className="object-bottom-right object-contain"
              />
            </div>
          )}
        </div>

        {/* Show title/caption for all media types */}
        {title && (
          <div
            className="mt-2 font-semibold"
            style={
              isSecretTheme
                ? {
                    color: "#faecb7",
                    fontFamily: "Smooch, cursive, Arial, sans-serif",
                  }
                : {}
            }
          >
            {title}
          </div>
        )}
      </div>

      {/* Fullscreen overlay with animation */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="relative w-[75vw] h-[75vh]" // Add 'relative' to make `fill` work
            >
              {imgSrc && (
                <Image
                  src={imgSrc}
                  alt={title}
                  fill // Use the fill prop for responsive images
                  className="object-contain"
                />
              )}
              {gifSrc && (
                // The <img> tag does not have the same requirements, so this is fine
                <img
                  src={gifSrc}
                  alt={title}
                  className="object-contain max-w-full max-h-full"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MediaCard;
