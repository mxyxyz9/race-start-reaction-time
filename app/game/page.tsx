"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { generateAIDrivers, getLightDelayRange } from "@/lib/drivers"
import { useGameContext } from "@/lib/game-context"
import type { DriverResult, ReactionTimeRecord } from "@/lib/types"
import StartingLights from "@/components/starting-lights"
import RaceTrack from "@/components/race-track"
import Scoreboard from "@/components/scoreboard"
import DifficultySelector from "@/components/difficulty-selector"
import SiteHeader from "@/components/site-header"
import StatisticsCard from "@/components/statistics-card"
import soundEffects from "@/lib/sound-effects"

type GameState = "ready" | "settings" | "countdown" | "lights" | "race" | "results"

export default function GamePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { settings, updateSettings, addReactionTime } = useGameContext()

  const [gameState, setGameState] = useState<GameState>("ready")
  const [countdown, setCountdown] = useState(3)
  const [lightCount, setLightCount] = useState(0)
  const [raceStarted, setRaceStarted] = useState(false)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [jumpStart, setJumpStart] = useState(false)
  const [aiDrivers, setAiDrivers] = useState<Array<{ name: string; time: number }>>([])
  const [results, setResults] = useState<DriverResult[]>([])

  const startTimeRef = useRef<number | null>(null)
  const lightsOffTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lightIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Show settings screen
  const showSettings = () => {
    soundEffects.play("click")
    setGameState("settings")
  }

  // Start the game countdown
  const startGame = () => {
    soundEffects.play("countdown")
    setGameState("countdown")
    setCountdown(3)

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          startLightSequence()
          return 0
        }
        soundEffects.play("countdown")
        return prev - 1
      })
    }, 1000)
  }

  // Start the F1 light sequence
  const startLightSequence = () => {
    setGameState("lights")
    setLightCount(0)
    setJumpStart(false)
    setReactionTime(null)

    // Get light delay range based on difficulty
    const delayRange = getLightDelayRange(settings.difficulty)

    // Turn on lights one by one
    lightIntervalRef.current = setInterval(() => {
      setLightCount((prev) => {
        if (prev >= 4) {
          clearInterval(lightIntervalRef.current!)
          soundEffects.play("engineRev")

          // Random delay before lights go out based on difficulty
          const randomDelay = Math.floor(Math.random() * (delayRange.max - delayRange.min)) + delayRange.min

          lightsOffTimeoutRef.current = setTimeout(() => {
            startTimeRef.current = Date.now()
            setRaceStarted(true)
            setGameState("race")
            setLightCount(0) // All lights off
            soundEffects.play("lightsOut")
          }, randomDelay)

          return 5
        }
        soundEffects.play("lightOn")
        return prev + 1
      })
    }, 800) // 0.8 seconds between each light
  }

  // Handle user reaction
  const handleReaction = () => {
    if (gameState === "lights") {
      // Jump start!
      setJumpStart(true)
      clearTimeout(lightsOffTimeoutRef.current!)
      clearInterval(lightIntervalRef.current!)

      soundEffects.play("jumpStart")

      toast({
        title: "Jump Start!",
        description: "You jumped the start! 5 second penalty applied.",
        variant: "destructive",
      })

      setTimeout(() => {
        showResults(true)
      }, 1500)

      return
    }

    if (gameState === "race" && startTimeRef.current) {
      const endTime = Date.now()
      const time = (endTime - startTimeRef.current) / 1000
      setReactionTime(time)
      soundEffects.play("finish")
      showResults(false, time)
    }
  }

  // Show final results
  const showResults = (isJumpStart: boolean, userTime?: number) => {
    // Generate AI drivers with realistic reaction times based on difficulty
    const drivers = generateAIDrivers(settings.numberOfDrivers, settings.difficulty)
    setAiDrivers(drivers)

    // Combine user and AI results
    const allResults = [...drivers]

    if (isJumpStart) {
      // Add user with penalty (5 second penalty for jump start)
      allResults.push({ name: "You", time: 5.0 })
    } else if (userTime !== undefined) {
      // Add user with their reaction time
      allResults.push({ name: "You", time: userTime })
    }

    // Sort by reaction time
    allResults.sort((a, b) => a.time - b.time)

    // Add position and isUser flag
    const resultsWithPosition = allResults.map((result, index) => ({
      ...result,
      position: index + 1,
      isUser: result.name === "You",
    }))

    setResults(resultsWithPosition)
    setGameState("results")

    // Save reaction time to context if not a jump start
    if (!isJumpStart && userTime !== undefined) {
      const record: ReactionTimeRecord = {
        time: userTime,
        date: new Date().toISOString(),
        difficulty: settings.difficulty,
      }
      addReactionTime(record)
    }
  }

  // Reset the game
  const resetGame = () => {
    soundEffects.play("click")
    setGameState("ready")
    setLightCount(0)
    setRaceStarted(false)
    setReactionTime(null)
    setJumpStart(false)
    startTimeRef.current = null

    if (lightsOffTimeoutRef.current) {
      clearTimeout(lightsOffTimeoutRef.current)
    }

    if (lightIntervalRef.current) {
      clearInterval(lightIntervalRef.current)
    }
  }

  // Clean up timeouts and intervals on unmount
  useEffect(() => {
    return () => {
      if (lightsOffTimeoutRef.current) {
        clearTimeout(lightsOffTimeoutRef.current)
      }

      if (lightIntervalRef.current) {
        clearInterval(lightIntervalRef.current)
      }
    }
  }, [])

  return (
    <>
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="container max-w-4xl">
          {gameState === "ready" && (
            <Card className="bg-[#1a1a24] border-[#27272a] p-8 text-center">
              <h2 className="text-2xl font-bold mb-6">Ready to Test Your Reaction Time?</h2>
              <p className="mb-8 text-gray-300">
                Wait for the five red lights to go out, then click as fast as you can!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-[#e10600] hover:bg-[#b30500] text-white font-bold px-8 py-6 text-lg"
                  onClick={startGame}
                >
                  Start Race
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#27272a] text-white hover:bg-[#27272a] px-8 py-6 text-lg"
                  onClick={showSettings}
                >
                  Settings
                </Button>
              </div>
              <div className="mt-6 inline-block bg-[#15151e] px-4 py-2 rounded-md border border-[#27272a]">
                <p className="text-sm text-gray-400">
                  Current difficulty: <span className="font-bold text-white capitalize">{settings.difficulty}</span>
                </p>
              </div>
            </Card>
          )}

          {gameState === "settings" && (
            <Card className="bg-[#1a1a24] border-[#27272a] p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Game Settings</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Difficulty Level</h3>
                  <DifficultySelector
                    selectedDifficulty={settings.difficulty}
                    onChange={(difficulty) => updateSettings({ difficulty })}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Number of AI Drivers</h3>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      className="border-[#27272a] text-white hover:bg-[#27272a] h-10 w-10 p-0"
                      onClick={() => {
                        soundEffects.play("click")
                        updateSettings({ numberOfDrivers: Math.max(1, settings.numberOfDrivers - 1) })
                      }}
                      disabled={settings.numberOfDrivers <= 1}
                    >
                      -
                    </Button>
                    <span className="text-xl font-bold w-8 text-center">{settings.numberOfDrivers}</span>
                    <Button
                      variant="outline"
                      className="border-[#27272a] text-white hover:bg-[#27272a] h-10 w-10 p-0"
                      onClick={() => {
                        soundEffects.play("click")
                        updateSettings({ numberOfDrivers: Math.min(10, settings.numberOfDrivers + 1) })
                      }}
                      disabled={settings.numberOfDrivers >= 10}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <Button
                  className="bg-[#e10600] hover:bg-[#b30500] text-white font-bold px-8 py-4"
                  onClick={() => {
                    soundEffects.play("click")
                    setGameState("ready")
                  }}
                >
                  Save Settings
                </Button>
              </div>
            </Card>
          )}

          {gameState === "countdown" && (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <div className="text-9xl font-bold text-[#e10600]">{countdown}</div>
              <p className="text-xl mt-4">Get ready...</p>
            </div>
          )}

          {(gameState === "lights" || gameState === "race") && (
            <div className="space-y-8">
              <StartingLights lightCount={lightCount} />

              <div className="flex justify-center mt-16">
                <Button
                  size="lg"
                  className={cn(
                    "w-64 h-24 text-xl font-bold transition-colors",
                    raceStarted ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700",
                  )}
                  onClick={handleReaction}
                >
                  {raceStarted ? "GO!" : "WAIT"}
                </Button>
              </div>

              {reactionTime !== null && (
                <div className="text-center mt-8">
                  <p className="text-2xl">
                    Your reaction time: <span className="font-bold text-[#e10600]">{reactionTime.toFixed(3)}s</span>
                  </p>
                </div>
              )}

              {jumpStart && (
                <div className="text-center mt-8">
                  <p className="text-2xl text-red-500 font-bold">JUMP START! 5 Second Penalty</p>
                </div>
              )}
            </div>
          )}

          {gameState === "results" && (
            <div className="space-y-8">
              <div className="bg-[#1a1a24] border border-[#27272a] rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-2">Race Results</h2>
                <p className="text-center text-gray-400 text-sm mb-6">
                  Difficulty: <span className="capitalize">{settings.difficulty}</span>
                </p>

                <RaceTrack results={results} />

                <Scoreboard results={results} />

                <StatisticsCard difficulty={settings.difficulty} className="mt-6" />

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                  <Button className="bg-[#e10600] hover:bg-[#b30500]" onClick={resetGame}>
                    Race Again
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#27272a] text-white hover:bg-[#27272a]"
                    onClick={() => {
                      soundEffects.play("click")
                      router.push("/leaderboard")
                    }}
                  >
                    View Stats
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
