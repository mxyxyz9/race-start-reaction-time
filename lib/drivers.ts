import type { Difficulty } from "./types"

// List of F1 driver names
const driverNames = [
  "Verstappen",
  "Hamilton",
  "Leclerc",
  "Norris",
  "Sainz",
  "Piastri",
  "Russell",
  "Alonso",
  "Perez",
  "Gasly",
  "Stroll",
  "Ocon",
  "Albon",
  "Tsunoda",
  "Bottas",
  "Hulkenberg",
  "Ricciardo",
  "Zhou",
  "Magnussen",
  "Sargeant",
]

// Reaction time ranges based on difficulty
const difficultySettings = {
  easy: {
    topDriver: { min: 0.28, max: 0.38 },
    regularDriver: { min: 0.3, max: 0.5 },
    lightDelayRange: { min: 1200, max: 3000 },
  },
  medium: {
    topDriver: { min: 0.22, max: 0.3 },
    regularDriver: { min: 0.22, max: 0.35 },
    lightDelayRange: { min: 800, max: 2200 },
  },
  hard: {
    topDriver: { min: 0.18, max: 0.25 },
    regularDriver: { min: 0.18, max: 0.28 },
    lightDelayRange: { min: 400, max: 1500 },
  },
}

/**
 * Get the light delay range based on difficulty
 */
export function getLightDelayRange(difficulty: Difficulty) {
  return difficultySettings[difficulty].lightDelayRange
}

/**
 * Generate a list of AI drivers with realistic reaction times
 * Reaction times vary based on difficulty level
 */
export function generateAIDrivers(count = 5, difficulty: Difficulty = "medium") {
  // Shuffle the driver names array
  const shuffledDrivers = [...driverNames].sort(() => Math.random() - 0.5)

  // Take the first 'count' drivers
  const selectedDrivers = shuffledDrivers.slice(0, count)

  // Get difficulty settings
  const settings = difficultySettings[difficulty]

  // Generate reaction times for each driver
  return selectedDrivers.map((name) => {
    // Top drivers (first 3 in the list) get slightly better times
    const isTopDriver = driverNames.indexOf(name) < 3
    const { min, max } = isTopDriver ? settings.topDriver : settings.regularDriver
    const time = min + Math.random() * (max - min)

    return {
      name,
      time,
    }
  })
}
