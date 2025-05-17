"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { generateAIDrivers, getLightDelayRange } from "@/lib/drivers"
import { useGameContext } from "@/lib/game-context"
import type { DriverResult, ChampionshipRace, ChampionshipSeason } from "@/lib/types"
import StartingLights from "@/components/starting-lights"
import RaceTrack from "@/components/race-track"
import Scoreboard from "@/components/scoreboard"
import SiteHeader from "@/components/site-header"
import soundEffects from "@/lib/sound-effects"

type GameState = "ready" | "countdown" | "lights" | "race" | "results"

export default function ChampionshipRacePage({ params }: { params: { id: string; raceId: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { championships, completeChampionshipRace } = useGameContext()

  const [championship, setChampionship] = useState<ChampionshipSeason | null>(null)
  const [race, setRace] = useState<ChampionshipRace | null>(null)
  const [gameState, setGameState] = useState<GameState>("ready")
  const [countdown, setCountdown] = useState(3)
  const [lightCount, setLightCount] = useState(0)
  const [raceStarted, setRaceStarted] = useState(false)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [jumpStart, setJumpStart] = useState(false)
  const [results, setResults] = useState<DriverResult[]>([])

  const startTimeRef = useRef<number | null>(null)
  const lightsOffTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lightIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load championship and race data
  useEffect(() => {
    const foundChampionship = championships.find((c) => c.id === params.id)
    if (foundChampionship) {
      setChampionship(foundChampionship)

      const foundRace = foundChampionship.races.find((r) => r.id === params.raceId)
      if (foundRace) {
        setRace(foundRace)

        // If race is already completed, show results
        if (foundRace.completed) {
          setResults(foundRace.results)
          setGameState("results")
        }
      } else {
        router.push(`/championship/${params.id}`)
      }
    } else {
      router.push("/championship")
    }
  }, [championships, params.id, params.raceId, router])

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
    const delayRange = race ? getLightDelayRange(race.difficulty) : { min: 800, max: 2200 }

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
    if (!race) return

    // Generate AI drivers with realistic reaction times based on difficulty
    const drivers = generateAIDrivers(5, race.difficulty)

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

    // Complete the championship race
    if (championship) {
      completeChampionshipRace(race.id, resultsWithPosition)
    }
  }

  // Reset the game
  const resetGame = () => {
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

  if (!championship || !race) {
    return (
      <>
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Loading race data...</h2>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="container max-w-4xl">
          {gameState === "ready" && (
            <Card className="bg-[#1a1a24] border-[#27272a] p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">{race.name}</h2>
              <p className="text-gray-400 mb-6 capitalize">
                Round {championship.races.indexOf(race) + 1} • {race.difficulty} difficulty
              </p>

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
                  onClick={() => {
                    soundEffects.play("click")
                    router.push(`/championship/${championship.id}`)
                  }}
                >
                  Back to Championship
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
              <h2 className="text-2xl font-bold text-center mb-2">{race.name}</h2>
              <p className="text-gray-400 text-center mb-6 capitalize">
                Round {championship.races.indexOf(race) + 1} • {race.difficulty} difficulty
              </p>

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
                <h2 className="text-2xl font-bold text-center mb-2">{race.name} Results</h2>
                <p className="text-center text-gray-400 text-sm mb-6 capitalize">
                  Round {championship.races.indexOf(race) + 1} • {race.difficulty} difficulty
                </p>

                <RaceTrack results={results} />

                <Scoreboard results={results} />

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                  {championship.currentRaceIndex < championship.races.length && !championship.completed ? (
                    <Button
                      className="bg-[#e10600] hover:bg-[#b30500]"
                      onClick={() => {
                        soundEffects.play("click")
                        const nextRace = championship.races[championship.currentRaceIndex]
                        router.push(`/championship/${championship.id}/race/${nextRace.id}`)
                      }}
                    >
                      Next Race
                    </Button>
                  ) : (
                    <Button
                      className="bg-[#e10600] hover:bg-[#b30500]"
                      onClick={() => {
                        soundEffects.play("click")
                        router.push(`/championship/${championship.id}`)
                      }}
                    >
                      Championship Results
                    </Button>
                  )}

                  {race.completed && (
                    <Button
                      variant="outline"
                      className="border-[#27272a] text-white hover:bg-[#27272a]"
                      onClick={() => {
                        soundEffects.play("click")
                        resetGame()
                      }}
                    >
                      Retry Race
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
