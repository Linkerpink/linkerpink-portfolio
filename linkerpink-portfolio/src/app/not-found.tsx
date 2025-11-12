"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useTheme } from "./theme-context"

export default function NotFound() {
  const { theme } = useTheme()

  const messages = [
    {
      text: "Even the image could not be found...",
      image: "/images/eng.png",
    },
    {
      text: "Looks like the page.. EXPLODED?!",
      image: "/images/bpm bomb.webp",
    },
    {
      text: "The power went out...",
      image: "/images/fnaf unity fortnite official game godot.webp",
    },
    {
      text: "This page got emoted on (skill issue)",
      image: "/images/shy dab.webp",
    },
    {
      text: "The quota didn't get reached, just like the page you're looking for.",
      image: "/images/not not balatro icon.webp",
    },
    {
      text: "This duck dropped too much soap on the server for it to load.",
      image: "/images/soap duck.webp",
    },
    {
      text: ".",
      image: "/images/soap duck.webp",
    },
  ]

  // Initialize state with a random message
  const [random, setRandom] = useState(() => {
    return messages[Math.floor(Math.random() * messages.length)]
  })

  useEffect(() => {
    // disable scrolling
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    document.body.style.margin = "0"
    document.documentElement.style.margin = "0"

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.margin = ""
      document.documentElement.style.margin = ""
    }
  }, [])

  const backgroundClass =
    theme === "light"
      ? "bg-gradient-to-b from-gray-100 to-white text-gray-900"
      : theme === "dark"
      ? "bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100"
      : "bg-gradient-to-b from-purple-900 via-black to-indigo-900 text-purple-100"

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent overflow-hidden">
      <div className="flex justify-center items-center w-full h-full md:pl-[10.5%]">
        <div
          className={`flex flex-col items-center justify-center text-center rounded-[2rem] p-12 w-[95%] max-w-2xl shadow-[0_0_40px_rgba(0,0,0,0.25)] transition-colors duration-700 ${backgroundClass}`}
        >
          <h1 className="text-6xl font-extrabold mb-6">404</h1>
          <img
            src={random.image}
            alt="404"
            className="w-64 h-64 object-contain mb-8 animate-fadeIn"
          />
          <p className="text-2xl mb-8 leading-relaxed">{random.text}</p>
          <Link
            href="/"
            className="px-6 py-3 text-lg text-white font-medium bg-[#F57C00] rounded-xl transition-colors interactable-object"
          >
            Go To Home
          </Link>
        </div>
      </div>
    </div>
  )
}
