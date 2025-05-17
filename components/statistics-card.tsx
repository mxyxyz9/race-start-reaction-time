import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGameContext } from "@/lib/game-context"
import type { Difficulty } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StatisticsCardProps {
  difficulty?: Difficulty
  className?: string
}

export default function StatisticsCard({ difficulty, className }: StatisticsCardProps) {
  const { getStatistics } = useGameContext()
  const stats = getStatistics(difficulty)

  return (
    <Card className={cn("bg-[#1a1a24] border-[#27272a] text-white", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
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
            <path d="M3 3v18h18"></path>
            <path d="m19 9-5 5-4-4-3 3"></path>
          </svg>
          Race Statistics
          {difficulty && <span className="ml-2 text-sm font-normal text-gray-400 capitalize">({difficulty})</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
          <div className="bg-[#15151e] p-3 rounded-lg border border-[#27272a]">
            <div className="text-sm text-gray-400">Best Time</div>
            <div className="text-xl font-bold mt-1">{stats.bestTime > 0 ? `${stats.bestTime.toFixed(3)}s` : "N/A"}</div>
          </div>

          <div className="bg-[#15151e] p-3 rounded-lg border border-[#27272a]">
            <div className="text-sm text-gray-400">Average</div>
            <div className="text-xl font-bold mt-1">
              {stats.averageTime > 0 ? `${stats.averageTime.toFixed(3)}s` : "N/A"}
            </div>
          </div>

          <div className="bg-[#15151e] p-3 rounded-lg border border-[#27272a]">
            <div className="text-sm text-gray-400">Total Races</div>
            <div className="text-xl font-bold mt-1">{stats.totalRaces}</div>
          </div>

          <div className="bg-[#15151e] p-3 rounded-lg border border-[#27272a]">
            <div className="text-sm text-gray-400">Wins</div>
            <div className="text-xl font-bold mt-1">{stats.wins}</div>
          </div>

          <div className="bg-[#15151e] p-3 rounded-lg border border-[#27272a]">
            <div className="text-sm text-gray-400">Podiums</div>
            <div className="text-xl font-bold mt-1">{stats.podiums}</div>
          </div>

          <div className="bg-[#15151e] p-3 rounded-lg border border-[#27272a]">
            <div className="text-sm text-gray-400">Jump Starts</div>
            <div className="text-xl font-bold mt-1">{stats.jumpStarts}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
