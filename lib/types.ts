export type Difficulty = "easy" | "medium" | "hard"

export interface GameSettings {
  difficulty: Difficulty
  numberOfDrivers: number
  soundEnabled: boolean
}

export interface DriverResult {
  name: string
  time: number
  position: number
  isUser?: boolean
  points?: number
}

export interface ReactionTimeRecord {
  time: number
  date: string
  difficulty: Difficulty
}

export interface ChampionshipRace {
  id: string
  name: string
  date: string
  difficulty: Difficulty
  results: DriverResult[]
  userReactionTime: number
  completed: boolean
}

export interface ChampionshipStanding {
  name: string
  points: number
  isUser: boolean
  bestPosition: number
  races: number
}

export interface ChampionshipSeason {
  id: string
  name: string
  races: ChampionshipRace[]
  standings: ChampionshipStanding[]
  currentRaceIndex: number
  completed: boolean
}

export interface RaceStatistics {
  totalRaces: number
  bestTime: number
  averageTime: number
  jumpStarts: number
  wins: number
  podiums: number
  difficulty: Difficulty
}
