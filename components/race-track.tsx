"use client"

import { useEffect, useState } from "react"
import type { DriverResult } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RaceTrackProps {
  results: DriverResult[]
}

export default function RaceTrack({ results }: RaceTrackProps) {
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Sort results by position
  const sortedResults = [...results].sort((a, b) => a.position - b.position)

  // Limit to 5 drivers for display
  const displayResults = sortedResults.slice(0, 5)

  return (
    <div className="bg-[#15151e] rounded-lg overflow-hidden p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
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
          className="mr-2 text-[#e10600]"
        >
          <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
        </svg>
        Race Visualization
      </h3>

      <div className="relative h-64 bg-[#0f0f15] rounded-lg overflow-hidden border border-[#27272a]">
        {/* Track markings */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#27272a]" />
          <div className="absolute bottom-0 left-0 w-full h-2 bg-[#27272a]" />

          {/* Lane dividers */}
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="absolute left-0 w-full h-px bg-[#27272a]" style={{ top: `${25 * (i + 1)}%` }} />
          ))}

          {/* Start/finish line */}
          <div className="absolute top-0 left-16 w-4 h-full bg-white opacity-50" />

          {/* Checkered pattern at finish */}
          <div className="absolute top-0 right-16 w-8 h-full flex flex-col">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex-1 flex">
                {Array.from({ length: 2 }, (_, j) => (
                  <div key={j} className={`flex-1 ${(i + j) % 2 === 0 ? "bg-white" : "bg-black"}`} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Driver name labels on left */}
        {displayResults.map((result, index) => (
          <div
            key={`name-${index}`}
            className="absolute flex items-center h-10 left-4"
            style={{ top: `${index * 20 + 5}%` }}
          >
            <div
              className={cn(
                "px-2 py-1 rounded text-xs font-medium",
                result.isUser ? "bg-[#e10600] text-white" : "bg-gray-700 text-white",
              )}
            >
              {index + 1}
            </div>
          </div>
        ))}

        {/* Cars */}
        {displayResults.map((result, index) => {
          // Calculate car position based on reaction time
          // Faster times = further along the track
          const progress = animationComplete
            ? Math.min(100 - result.time * 20, 90) // Cap at 90% to keep cars on screen
            : 0

          // Determine if this is the user's car
          const isUser = result.isUser

          return (
            <div
              key={`car-${index}`}
              className="absolute h-10 transition-all duration-2000 ease-out flex items-center"
              style={{
                top: `${index * 20 + 5}%`,
                left: `${progress}%`,
                transitionDuration: "2000ms",
              }}
            >
              <div
                className={cn(
                  "h-7 rounded-md flex items-center justify-center text-xs font-bold px-3",
                  isUser ? "bg-[#e10600] text-white" : "bg-gray-200 text-black",
                )}
              >
                {result.name}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
