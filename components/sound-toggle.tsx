"use client"

import { Button } from "@/components/ui/button"
import { useGameContext } from "@/lib/game-context"
import soundEffects from "@/lib/sound-effects"

export default function SoundToggle() {
  const { settings, toggleSound } = useGameContext()

  const handleToggle = () => {
    soundEffects.play("click")
    toggleSound()
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8 border-[#27272a] text-white hover:bg-[#27272a]"
      onClick={handleToggle}
      aria-label={settings.soundEnabled ? "Mute sound" : "Unmute sound"}
    >
      {settings.soundEnabled ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      )}
    </Button>
  )
}
