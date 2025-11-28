"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

import GameCard from "./game-card";
const featuredProjects = allProjects.filter((p) => p.featured);

// First 2 = large cards, next up to 4 = small cards
const firstRow = featuredProjects.slice(0, 2);
const secondRow = featuredProjects.slice(2, 6); // max 4 small cards

import { allProjects } from "./projects/all-projects";

import SkillCard from "./skill-card";
import Skills from "./skills";

import LinkCard from "./link-card";
import Links from "./links";
import { useTheme } from "./theme-context";
//import { CalculateTime } from "./calculate-time";
import { CalculateTimeYearOnly } from "./calculate-time";

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [thumbRect, setThumbRect] = useState<DOMRect | null>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const isSecretTheme = theme === "secret";
  const isDarkTheme = theme === "dark";

  const isMobile = useMediaQuery({ maxWidth: 767 }); // Tailwind 'md' breakpoint

  let gradientClass = "";
  if (!isSecretTheme) {
    gradientClass = isDarkTheme ? "card-gradient-dark" : "card-gradient-light";
  } else {
    gradientClass = "card-gradient-secret";
  }

  const openOverlay = () => {
    if (thumbRef.current) {
      const rect = thumbRef.current.getBoundingClientRect();
      setThumbRect(rect);
      setIsExpanded(true);
    }
  };

  const closeOverlay = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id !== "expanded-image") {
      setIsExpanded(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <AnimatePresence>
        {isExpanded && thumbRect && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            draggable={false}
            onClick={closeOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.35,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <motion.div
              className="relative w-[80%] max-w-4xl"
              initial={{
                x: thumbRect.left + thumbRect.width / 2 - window.innerWidth / 2,
                y:
                  thumbRect.top + thumbRect.height / 2 - window.innerHeight / 2,
                scale: thumbRect.width / (window.innerWidth * 0.8),
              }}
              animate={{ x: 0, y: 0, scale: 1 }}
              exit={{
                x: thumbRect.left + thumbRect.width / 2 - window.innerWidth / 2,
                y:
                  thumbRect.top + thumbRect.height / 2 - window.innerHeight / 2,
                scale: thumbRect.width / (window.innerWidth * 0.8),
              }}
              transition={{
                duration: 0.25,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <Image
                id="expanded-image"
                src="/images/about me p1.jpg"
                alt="About Me Zoomed"
                className="w-full h-full shadow-2xl"
                width={2560}
                height={2560}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Games Section */}
      <div
        className={`transition-all duration-300 ${isExpanded ? "blur-sm" : ""}`}
      >
        <div id="home" className="games">
          {/* First Row: 2 large cards */}
          <div className="content-row flex flex-wrap md:flex-nowrap md:justify-center -m-2 mb-4">
            {firstRow.map((project, i) => (
              <GameCard
                key={i}
                title={project.title}
                href={`/projects/${project.slug}`}
                imgSrc={
                  project.imgSrc ||
                  project.media?.find((m) => m.type === "image")?.src ||
                  "/images/fallback-image.png"
                }
                displayDate={project.displayDate}
                technologies={project.technologies}
                size={isMobile ? "small" : "large"}
              />
            ))}
          </div>

          {/* Second Row: up to 4 small cards */}
          <div className="content-row flex flex-wrap md:flex-nowrap md:justify-center -m-2">
            {secondRow.map((project, i) => (
              <GameCard
                key={i}
                title={project.title}
                href={`/projects/${project.slug}`}
                imgSrc={
                  project.imgSrc ||
                  project.media?.find((m) => m.type === "image")?.src ||
                  "/images/fallback-image.png"
                }
                displayDate={project.displayDate}
                technologies={project.technologies}
                size="small"
              />
            ))}
          </div>
        </div>

        <div className="w-full pt-16 px-4">
          <Link
            href="/projects"
            className="block group interactable-object"
            prefetch={false}
            draggable={false}
          >
            <div
              className={`flex items-center rounded-[10px] p-4 shadow-lg cursor-pointer select-none ${gradientClass}`}
              draggable={false}
            >
              <div className="w-full h-full flex items-center justify-center overflow-hidden select-none">
                <h1 className="text-4xl font-bold text-center">See all</h1>
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-medium text-center text-[#5F5F5F] p-2 cursor-default">
            Browse all projects
          </h1>
        </div>


        {/* About Me */}
        <div
          className={`flex flex-col md:flex-row items-center md:items-start gap-8 px-4 pt-20 max-w-6xl mx-auto transition-all duration-300 ${isExpanded ? "blur-sm" : ""
            }`}
        >
          <div
            ref={thumbRef}
            className="group w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 relative flex-shrink-0 cursor-pointer"
            onClick={openOverlay}
          >
            <Image
              src="/images/about me p1.jpg"
              alt="About Me Image"
              fill
              className="interactable-object object-cover rounded-lg"
              style={{ outlineStyle: "solid" }}
            />
          </div>

          <div id="about-me" className="text-center md:text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Hello there, my name is
              <p></p>
              <span className="text-[#F57C00]"> Noah van Uunen</span>
              <p className="text-lg sm:text-xl mt-2 text-gray-600 dark:text-gray-400">
                (<span className="font-semibold text-[#F57C00]">linkerpink</span>)
              </p>
            </h1>
            <h3 className="text-base sm:text-lg">
              I am an {CalculateTimeYearOnly("2007-04-20")}-year-old game developer from the Netherlands. 
              I enjoy programming and seeing my ideas come to life. 
              I started gamedev in early 2022 and made a few games and prototypes before getting inspired to study game development at college.
              development at Grafisch Lyceum Utrecht.
              Outside of game dev, I enjoy
              playing guitar, editing videos, listening to music and playing games.
            </h3>
          </div>
        </div>

        <div
          id="skills"
          className={`pt-20 px-4 transition-all duration-300 ${isExpanded ? "blur-sm" : ""
            }`}
        >
          <h2 className="text-4xl font-bold mb-8 text-center user-select-none select-none">My Skills</h2>
          <div className="flex flex-wrap justify-center max-w-4xl mx-auto px-4">
            {Skills.map((skill, i) => (
              <SkillCard key={i} {...skill} />
            ))}
          </div>
        </div>

        <div
          id="links"
          className={`pt-20 px-4 transition-all duration-300 ${isExpanded ? "blur-sm" : ""
            }`}
        >
          <h2 className="text-4xl font-bold mb-3 text-center user-select-none select-none">Contact Me</h2>
          <div className="flex flex-wrap justify-center max-w-4xl mx-auto px-4">
            {Links.map((link, i) => (
              <LinkCard key={i} logo={link.logo} href={link.href} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
