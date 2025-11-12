"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "./theme-context"

const messages = [
  {
    text: "Looks like the page.. EXPLODED?!",
    image: "/images/bpm bomb.webp",
  },
  {
    text: "We're sorry, but the servers running this page suffer from a liquid leakage. If you see someone carrying a lot of soap with them, please inform us so we can take action.",
    image: "/images/soap duck.webp",
  },
  {
    text: "This page got emoted on (skill issue)",
    image: "/images/shy dab.webp",
  },
  {
    text: "He took the soul from the page.",
    image: "/images/jeremy.webp",
  },
  {
    text: "TUNUNUNUNU NU NUNUNUNUNU NU NUUUUUUUU UUUUUU UUUUUUUU UUUUUU.",
    image: "/images/maxwell.webp",
  },
  {
    text: "Looks like the power went out in the building...",
    image: "/images/fnaf power out.webp",
  },
  {
    text: "The quota didn't get reached, just like the page you're looking for.",
    image: "/images/not not balatro icon.webp",
  },
  {
    text: "Even the image could not be found...",
    image: "/images/eng.png",
  },
]

export default function NotFound() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [random, setRandom] = useState(messages[0])

  useEffect(() => {
    setMounted(true)
    setRandom(messages[Math.floor(Math.random() * messages.length)])
  }, [])

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  if (!mounted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/80 text-white">
        <p className="text-lg">Loading 404...</p>
      </div>
    )
  }

  const backgroundClass =
    theme === "light"
      ? "bg-gradient-to-b from-gray-100 to-white text-gray-900"
      : theme === "dark"
      ? "bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100"
      : "bg-gradient-to-b from-red-600 via-yellow-500 via-green-500 via-blue-600 to-purple-700 text-white"

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-transparent overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="flex justify-center items-center w-full h-full md:pl-[10.5%]">
        <div
          className={`flex flex-col items-center justify-center text-center rounded-[2rem] p-12 w-[95%] max-w-2xl shadow-[0_0_40px_rgba(0,0,0,0.25)] transition-colors duration-700 ${backgroundClass}`}
        >
          <h1 className="text-6xl font-extrabold mb-6">404</h1>
          <img
            src={random.image}
            alt="404"
            className="w-64 h-64 object-contain mb-8 select-none rounded-3xl"
            draggable={false}
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
    </motion.div>
  )
}
