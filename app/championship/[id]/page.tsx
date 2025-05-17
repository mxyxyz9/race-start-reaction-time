"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGameContext } from "@/lib/game-context"
import SiteHeader from "@/components/site-header"
import type { ChampionshipSeason } from "@/lib/types"
import soundEffects from "@/lib/sound-effects"

export default function ChampionshipDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { championships } = useGameContext()
  const [championship, setChampionship] = useState<ChampionshipSeason | null>(null)

  useEffect(() => {
    const found = championships.find((c) => c.id === params.id)
    if (found) {
      setChampionship(found)
    } else {
      router.push("/championship")
    }
  }, [championships, params.id, router])

  if (!championship) {
    return (
      <>
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Loading championship data...</h2>
          </div>
        </div>
      </>
    )
  }

  const handleContinueRace = () => {
    soundEffects.play("click")
    if (championship && !championship.completed) {
      const nextRaceIndex = championship.currentRaceIndex
      const nextRace = championship.races[nextRaceIndex]
      router.push(`/championship/${championship.id}/race/${nextRace.id}`)
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 p-4">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              className="border-[#27272a] text-white hover:bg-[#27272a]"
              onClick={() => {
                soundEffects.play("click")
                router.push("/championship")
              }}
            >
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
                className="mr-2"
              >
                <path d="m15 18-6-6 6-6"></path>
              </svg>
              Back
            </Button>

            {!championship.completed && (
              <Button className="bg-[#e10600] hover:bg-[#b30500]" onClick={handleContinueRace}>
                Continue Championship
              </Button>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-6">{championship.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-[#1a1a24] border-[#27272a] text-white">
              <CardHeader>
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
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                    <path d="M4 22h16"></path>
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                  </svg>
                  Championship Standings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-[#27272a] overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#27272a] hover:bg-[#1a1a24]">
                        <TableHead className="text-gray-300 w-12">Pos</TableHead>
                        <TableHead className="text-gray-300">Driver</TableHead>
                        <TableHead className="text-gray-300 text-right">Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {championship.standings.length > 0 ? (
                        championship.standings.map((standing, index) => (
                          <TableRow
                            key={index}
                            className={`border-[#27272a] ${
                              standing.isUser ? "bg-[#1a1a24] hover:bg-[#1a1a24]" : "hover:bg-[#1a1a24]"
                            }`}
                          >
                            <TableCell className="font-medium">
                              <div className="w-6 h-6 rounded-full bg-[#27272a] flex items-center justify-center text-xs">
                                {index + 1}
                              </div>
                            </TableCell>
                            <TableCell className={standing.isUser ? "font-bold text-[#e10600]" : ""}>
                              {standing.name}
                              {standing.isUser && <span className="ml-1 text-xs">(You)</span>}
                            </TableCell>
                            <TableCell className="text-right font-bold">{standing.points}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-gray-400">
                            No standings available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a24] border-[#27272a] text-white">
              <CardHeader>
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
                    <path d="M2 12h20"></path>
                    <path d="M12 2v20"></path>
                    <path d="m4.93 4.93 14.14 14.14"></path>
                    <path d="m19.07 4.93-14.14 14.14"></path>
                  </svg>
                  Race Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-[#27272a] overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#27272a] hover:bg-[#1a1a24]">
                        <TableHead className="text-gray-300 w-12">Race</TableHead>
                        <TableHead className="text-gray-300">Circuit</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {championship.races.map((race, index) => (
                        <TableRow
                          key={race.id}
                          className={`border-[#27272a] ${
                            index === championship.currentRaceIndex && !championship.completed
                              ? "bg-[#1a1a24] hover:bg-[#1a1a24]"
                              : "hover:bg-[#1a1a24]"
                          }`}
                        >
                          <TableCell className="font-medium">
                            <div className="w-6 h-6 rounded-full bg-[#27272a] flex items-center justify-center text-xs">
                              {index + 1}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{race.name}</div>
                            <div className="text-xs text-gray-400 capitalize">{race.difficulty} difficulty</div>
                          </TableCell>
                          <TableCell>
                            {race.completed ? (
                              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
                                Completed
                              </div>
                            ) : index === championship.currentRaceIndex && !championship.completed ? (
                              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#e10600] text-white">
                                Next
                              </div>
                            ) : (
                              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400">
                                Upcoming
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#1a1a24] border-[#27272a] text-white mb-6">
            <CardHeader>
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
                  <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
                </svg>
                Race Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {championship.races
                  .filter((race) => race.completed)
                  .map((race) => (
                    <div key={race.id} className="bg-[#15151e] rounded-lg border border-[#27272a] overflow-hidden">
                      <div className="p-3 border-b border-[#27272a] flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{race.name}</h3>
                          <p className="text-xs text-gray-400 capitalize">{race.difficulty} difficulty</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#27272a] text-white hover:bg-[#27272a] h-8"
                          onClick={() => {
                            soundEffects.play("click")
                            router.push(`/championship/${championship.id}/race/${race.id}`)
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                      <div className="p-3">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">Winner:</span>{" "}
                            <span className="font-medium">{race.results[0]?.name || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Your Position:</span>{" "}
                            <span className="font-medium">{race.results.find((r) => r.isUser)?.position || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Your Time:</span>{" "}
                            <span className="font-medium">
                              {race.userReactionTime > 0 ? `${race.userReactionTime.toFixed(3)}s` : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {championship.races.filter((race) => race.completed).length === 0 && (
                  <div className="text-center py-6 text-gray-400">
                    No races completed yet. Start racing to see results here.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
