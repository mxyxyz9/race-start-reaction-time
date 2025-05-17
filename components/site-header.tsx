"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import SoundToggle from "@/components/sound-toggle"
import { cn } from "@/lib/utils"
import soundEffects from "@/lib/sound-effects"

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    soundEffects.play("click")
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="border-b border-[#27272a] bg-[#1a1a24] py-4 w-full sticky top-0 z-50">
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-20" onClick={() => soundEffects.play("click")}>
          <div className="w-8 h-8 bg-[#e10600] rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
              <path d="M7 7h.01"></path>
            </svg>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            F1 <span className="text-[#e10600]">Reaction Test</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-white hover:text-[#e10600] transition-colors"
            onClick={() => soundEffects.play("click")}
          >
            Home
          </Link>
          <Link
            href="/game"
            className="text-white hover:text-[#e10600] transition-colors"
            onClick={() => soundEffects.play("click")}
          >
            Play
          </Link>
          <Link
            href="/championship"
            className="text-white hover:text-[#e10600] transition-colors"
            onClick={() => soundEffects.play("click")}
          >
            Championship
          </Link>
          <Link
            href="/leaderboard"
            className="text-white hover:text-[#e10600] transition-colors"
            onClick={() => soundEffects.play("click")}
          >
            Stats
          </Link>
          <SoundToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden z-20">
          <SoundToggle />
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "fixed inset-0 bg-[#0f0f15] flex flex-col items-center justify-center transition-transform duration-300 ease-in-out z-10",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <nav className="flex flex-col items-center space-y-8 text-xl">
            <Link
              href="/"
              className="text-white hover:text-[#e10600] transition-colors"
              onClick={() => {
                setMobileMenuOpen(false)
                soundEffects.play("click")
              }}
            >
              Home
            </Link>
            <Link
              href="/game"
              className="text-white hover:text-[#e10600] transition-colors"
              onClick={() => {
                setMobileMenuOpen(false)
                soundEffects.play("click")
              }}
            >
              Play
            </Link>
            <Link
              href="/championship"
              className="text-white hover:text-[#e10600] transition-colors"
              onClick={() => {
                setMobileMenuOpen(false)
                soundEffects.play("click")
              }}
            >
              Championship
            </Link>
            <Link
              href="/leaderboard"
              className="text-white hover:text-[#e10600] transition-colors"
              onClick={() => {
                setMobileMenuOpen(false)
                soundEffects.play("click")
              }}
            >
              Stats
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
