import type { DriverResult } from "@/lib/types"

interface ScoreboardProps {
  results: DriverResult[]
}

export default function Scoreboard({ results }: ScoreboardProps) {
  return (
    <div className="bg-[#15151e] rounded-lg p-4 mt-6">
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
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
          <line x1="3" x2="21" y1="9" y2="9"></line>
          <line x1="3" x2="21" y1="15" y2="15"></line>
          <line x1="9" x2="9" y1="3" y2="21"></line>
          <line x1="15" x2="15" y1="3" y2="21"></line>
        </svg>
        Reaction Times
      </h3>

      <div className="overflow-hidden rounded-md border border-[#27272a]">
        <div className="grid grid-cols-12 bg-[#1a1a24] p-3 text-sm font-medium">
          <div className="col-span-2 text-center">Pos</div>
          <div className="col-span-6">Driver</div>
          <div className="col-span-4 text-right">Time</div>
        </div>

        <div className="divide-y divide-[#27272a]">
          {results.map((result) => {
            // Determine if this is the user's result
            const isUser = result.isUser

            return (
              <div
                key={result.name}
                className={`grid grid-cols-12 p-3 text-sm ${
                  isUser ? "bg-[#1a1a24] border-l-4 border-l-[#e10600]" : ""
                }`}
              >
                <div className="col-span-2 text-center">
                  <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#27272a] text-xs font-medium">
                    {result.position}
                  </div>
                </div>
                <div className="col-span-6">
                  <p className={`font-medium truncate ${isUser ? "text-[#e10600]" : "text-white"}`}>
                    {result.name}
                    {isUser && <span className="ml-2 text-xs text-gray-400">(You)</span>}
                  </p>
                </div>
                <div className="col-span-4 text-right">
                  <p className="text-base font-bold tabular-nums">{result.time.toFixed(3)}s</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
