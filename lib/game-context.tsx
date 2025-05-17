"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { v4 as uuidv4 } from "uuid"
import type { GameSettings, ReactionTimeRecord, ChampionshipSeason, ChampionshipRace, RaceStatistics } from "./types"
import soundEffects from "./sound-effects"

interface GameContextType {
  settings: GameSettings
  updateSettings: (settings: Partial<GameSettings>) => void
  reactionTimes: ReactionTimeRecord[]
  addReactionTime: (record: ReactionTimeRecord) => void
  clearReactionTimes: () => void
  bestTime: ReactionTimeRecord | null
  championships: ChampionshipSeason[]
  currentChampionship: ChampionshipSeason | null
  startNewChampionship: () => ChampionshipSeason
  completeChampionshipRace: (raceId: string, results: any) => void
  getStatistics: (difficulty?: string) => RaceStatistics
  toggleSound: () => boolean
}

const defaultSettings: GameSettings = {
  difficulty: "medium",
  numberOfDrivers: 5,
  soundEnabled: true,
}

const GameContext = createContext<GameContextType | undefined>(undefined)

// Points system similar to F1
const POINTS_SYSTEM = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]

// Generate race names for championship
const generateRaceNames = () => {
  const races = [
    "Monaco Grand Prix",
    "British Grand Prix",
    "Italian Grand Prix",
    "Belgian Grand Prix",
    "Japanese Grand Prix",
    "Brazilian Grand Prix",
    "Abu Dhabi Grand Prix",
    "Australian Grand Prix",
    "Spanish Grand Prix",
    "Canadian Grand Prix",
  ]

  // Shuffle the races
  return [...races].sort(() => Math.random() - 0.5).slice(0, 5)
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(() => {
    // Try to load settings from localStorage
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("gameSettings")
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings
    }
    return defaultSettings
  })

  const [reactionTimes, setReactionTimes] = useState<ReactionTimeRecord[]>(() => {
    // Try to load reaction times from localStorage
    if (typeof window !== "undefined") {
      const savedTimes = localStorage.getItem("reactionTimes")
      return savedTimes ? JSON.parse(savedTimes) : []
    }
    return []
  })

  const [championships, setChampionships] = useState<ChampionshipSeason[]>(() => {
    // Try to load championships from localStorage
    if (typeof window !== "undefined") {
      const savedChampionships = localStorage.getItem("championships")
      return savedChampionships ? JSON.parse(savedChampionships) : []
    }
    return []
  })

  const [currentChampionship, setCurrentChampionship] = useState<ChampionshipSeason | null>(() => {
    // Find the first incomplete championship
    if (typeof window !== "undefined" && championships.length > 0) {
      return championships.find((c) => !c.completed) || null
    }
    return null
  })

  // Calculate best time
  const bestTime =
    reactionTimes.length > 0
      ? reactionTimes.reduce(
          (best, current) => (best === null || current.time < best.time ? current : best),
          null as ReactionTimeRecord | null,
        )
      : null

  // Update settings
  const updateSettings = (newSettings: Partial<GameSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("gameSettings", JSON.stringify(updatedSettings))
    }
  }

  // Add a new reaction time
  const addReactionTime = (record: ReactionTimeRecord) => {
    const updatedTimes = [record, ...reactionTimes].slice(0, 20) // Keep only the 20 most recent times
    setReactionTimes(updatedTimes)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("reactionTimes", JSON.stringify(updatedTimes))
    }
  }

  // Clear all reaction times
  const clearReactionTimes = () => {
    setReactionTimes([])

    // Clear from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("reactionTimes")
    }
  }

  // Start a new championship season
  const startNewChampionship = () => {
    const raceNames = generateRaceNames()

    // Create races
    const races: ChampionshipRace[] = raceNames.map((name, index) => ({
      id: uuidv4(),
      name,
      date: new Date(Date.now() + index * 86400000).toISOString(), // One day apart
      difficulty: settings.difficulty,
      results: [],
      userReactionTime: 0,
      completed: false,
    }))

    // Create new championship
    const newChampionship: ChampionshipSeason = {
      id: uuidv4(),
      name: `F1 Season ${new Date().getFullYear()}`,
      races,
      standings: [],
      currentRaceIndex: 0,
      completed: false,
    }

    // Update state
    const updatedChampionships = [newChampionship, ...championships]
    setChampionships(updatedChampionships)
    setCurrentChampionship(newChampionship)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("championships", JSON.stringify(updatedChampionships))
    }

    return newChampionship
  }

  // Complete a championship race
  const completeChampionshipRace = (raceId: string, results: any) => {
    if (!currentChampionship) return

    // Find the race
    const updatedChampionship = { ...currentChampionship }
    const raceIndex = updatedChampionship.races.findIndex((r) => r.id === raceId)

    if (raceIndex === -1) return

    // Update race results
    updatedChampionship.races[raceIndex].results = results
    updatedChampionship.races[raceIndex].completed = true
    updatedChampionship.races[raceIndex].userReactionTime = results.find((r: any) => r.isUser)?.time || 0

    // Calculate points for each driver
    results.forEach((result: any, index: number) => {
      const points = index < POINTS_SYSTEM.length ? POINTS_SYSTEM[index] : 0
      result.points = points

      // Update standings
      const driverIndex = updatedChampionship.standings.findIndex((s) => s.name === result.name)

      if (driverIndex === -1) {
        // Add new driver to standings
        updatedChampionship.standings.push({
          name: result.name,
          points: points,
          isUser: result.isUser || false,
          bestPosition: result.position,
          races: 1,
        })
      } else {
        // Update existing driver
        updatedChampionship.standings[driverIndex].points += points
        updatedChampionship.standings[driverIndex].races += 1
        updatedChampionship.standings[driverIndex].bestPosition = Math.min(
          updatedChampionship.standings[driverIndex].bestPosition,
          result.position,
        )
      }
    })

    // Sort standings by points
    updatedChampionship.standings.sort((a, b) => b.points - a.points)

    // Update current race index
    updatedChampionship.currentRaceIndex = raceIndex + 1

    // Check if championship is completed
    if (updatedChampionship.currentRaceIndex >= updatedChampionship.races.length) {
      updatedChampionship.completed = true
    }

    // Update championships
    const updatedChampionships = championships.map((c) => (c.id === updatedChampionship.id ? updatedChampionship : c))

    setChampionships(updatedChampionships)
    setCurrentChampionship(updatedChampionship)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("championships", JSON.stringify(updatedChampionships))
    }
  }

  // Get statistics
  const getStatistics = (difficulty?: string): RaceStatistics => {
    const filteredTimes = difficulty ? reactionTimes.filter((t) => t.difficulty === difficulty) : reactionTimes

    // Calculate statistics
    const totalRaces = filteredTimes.length
    const bestTime = totalRaces > 0 ? Math.min(...filteredTimes.map((t) => t.time)) : 0
    const averageTime = totalRaces > 0 ? filteredTimes.reduce((sum, t) => sum + t.time, 0) / totalRaces : 0

    // Get championship data
    const relevantChampionships = difficulty
      ? championships.filter((c) => c.races[0]?.difficulty === difficulty)
      : championships

    const allRaces = relevantChampionships.flatMap((c) => c.races)
    const completedRaces = allRaces.filter((r) => r.completed)

    // Count jump starts (reaction time of 5.0 seconds)
    const jumpStarts = completedRaces.filter((r) => r.userReactionTime >= 5.0).length

    // Count wins and podiums
    const wins = completedRaces.filter((r) =>
      r.results.find((result: any) => result.isUser && result.position === 1),
    ).length

    const podiums = completedRaces.filter((r) =>
      r.results.find((result: any) => result.isUser && result.position <= 3),
    ).length

    return {
      totalRaces,
      bestTime,
      averageTime,
      jumpStarts,
      wins,
      podiums,
      difficulty: (difficulty as any) || "medium",
    }
  }

  // Toggle sound
  const toggleSound = (): boolean => {
    const newState = soundEffects.toggleMute()
    updateSettings({ soundEnabled: !newState })
    return !newState
  }

  // Initialize sound effects based on settings
  useEffect(() => {
    if (soundEffects.isMuted() === settings.soundEnabled) {
      soundEffects.toggleMute()
    }
  }, [settings.soundEnabled])

  return (
    <GameContext.Provider
      value={{
        settings,
        updateSettings,
        reactionTimes,
        addReactionTime,
        clearReactionTimes,
        bestTime,
        championships,
        currentChampionship,
        startNewChampionship,
        completeChampionshipRace,
        getStatistics,
        toggleSound,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGameContext() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider")
  }
  return context
}
