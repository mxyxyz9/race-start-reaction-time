"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGameContext } from "@/lib/game-context"
import SiteHeader from "@/components/site-header"
import StatisticsCard from "@/components/statistics-card"
import soundEffects from "@/lib/sound-effects"

export default function ChampionshipPage() {
  const router = useRouter()
  const { championships, currentChampionship, startNewChampionship } = useGameContext()
  const [activeTab, setActiveTab] = useState<string>("current")

  // Handle starting a new championship
  const handleStartChampionship = () => {
    soundEffects.play("click")
    const championship = startNewChampionship()
    router.push(`/championship/${championship.id}`)
  }

  // Handle continuing current championship
  const handleContinueChampionship = () => {
    soundEffects.play("click")
    if (currentChampionship) {
      const nextRaceIndex = currentChampionship.currentRaceIndex
      const nextRace = currentChampionship.races[nextRaceIndex]
      router.push(`/championship/${currentChampionship.id}/race/${nextRace.id}`)
    }
  }

  // Set active tab based on championship status
  useEffect(() => {
    if (currentChampionship) {
      setActiveTab("current")
    } else if (championships.length > 0) {
      setActiveTab("past")
    }
  }, [currentChampionship, championships])

  return (
    <>
      <SiteHeader />
      <main className="flex-1 flex flex-col p-4">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center my-6">F1 Championship Mode</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="current" disabled={!currentChampionship}>
                Current Season
              </TabsTrigger>
              <TabsTrigger value="past" disabled={championships.length === 0}>
                Past Seasons
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-6">
              {currentChampionship ? (
                <>
                  <Card className="bg-[#1a1a24] border-[#27272a] text-white overflow-hidden">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#e10600] to-transparent opacity-10"></div>
                      <CardHeader>
                        <CardTitle className="text-2xl">{currentChampionship.name}</CardTitle>
                      </CardHeader>
                    </div>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center">
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
                            Upcoming Races
                          </h3>
                          <div className="space-y-2">
                            {currentChampionship.races
                              .slice(currentChampionship.currentRaceIndex)
                              .map((race, index) => (
                                <div
                                  key={race.id}
                                  className="flex items-center justify-between p-3 bg-[#15151e] rounded-lg border border-[#27272a]"
                                >
                                  <div>
                                    <div className="font-medium">{race.name}</div>
                                    <div className="text-sm text-gray-400 capitalize">{race.difficulty} difficulty</div>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-[#27272a] flex items-center justify-center mr-2">
                                      {currentChampionship.currentRaceIndex + index + 1}
                                    </div>
                                    {index === 0 && (
                                      <div className="text-xs px-2 py-1 bg-[#e10600] text-white rounded">Next</div>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center">
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
                          </h3>
                          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {currentChampionship.standings.length > 0 ? (
                              currentChampionship.standings.map((standing, index) => (
                                <div
                                  key={index}
                                  className={`flex items-center justify-between p-3 rounded-lg ${
                                    standing.isUser
                                      ? "bg-[#1a1a24] border-l-4 border-l-[#e10600]"
                                      : "bg-[#15151e] border border-[#27272a]"
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-[#27272a] flex items-center justify-center mr-2 text-xs">
                                      {index + 1}
                                    </div>
                                    <div className={standing.isUser ? "font-bold text-[#e10600]" : "font-medium"}>
                                      {standing.name}
                                      {standing.isUser && <span className="ml-1 text-xs">(You)</span>}
                                    </div>
                                  </div>
                                  <div className="font-bold">{standing.points} pts</div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-4 text-gray-400">
                                No standings yet. Complete a race to see standings.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <Button
                          className="bg-[#e10600] hover:bg-[#b30500] text-white font-bold px-6 py-2"
                          onClick={handleContinueChampionship}
                        >
                          Continue Championship
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <StatisticsCard />
                </>
              ) : (
                <Card className="bg-[#1a1a24] border-[#27272a] text-white p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">No Active Championship</h2>
                  <p className="mb-6 text-gray-400">Start a new championship season to compete for the title!</p>
                  <Button
                    className="bg-[#e10600] hover:bg-[#b30500] text-white font-bold px-6 py-2"
                    onClick={handleStartChampionship}
                  >
                    Start New Championship
                  </Button>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {championships.filter((c) => c.completed).length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {championships
                      .filter((c) => c.completed)
                      .map((championship) => (
                        <Card key={championship.id} className="bg-[#1a1a24] border-[#27272a] text-white">
                          <CardHeader>
                            <CardTitle className="text-xl">{championship.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-400 mb-2">Champion</h4>
                                {championship.standings.length > 0 && (
                                  <div
                                    className={`flex items-center p-3 rounded-lg ${
                                      championship.standings[0].isUser
                                        ? "bg-[#1a1a24] border-l-4 border-l-[#e10600]"
                                        : "bg-[#15151e] border border-[#27272a]"
                                    }`}
                                  >
                                    <div className="w-6 h-6 rounded-full bg-[#e10600] flex items-center justify-center mr-2 text-xs text-white">
                                      1
                                    </div>
                                    <div
                                      className={
                                        championship.standings[0].isUser ? "font-bold text-[#e10600]" : "font-medium"
                                      }
                                    >
                                      {championship.standings[0].name}
                                      {championship.standings[0].isUser && <span className="ml-1 text-xs">(You)</span>}
                                    </div>
                                    <div className="ml-auto font-bold">{championship.standings[0].points} pts</div>
                                  </div>
                                )}
                              </div>

                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-400 mb-2">Your Result</h4>
                                {championship.standings.find((s) => s.isUser) ? (
                                  <div className="p-3 bg-[#15151e] rounded-lg border border-[#27272a]">
                                    <div className="flex items-center justify-between">
                                      <div className="font-medium">Position</div>
                                      <div className="font-bold">
                                        {championship.standings.findIndex((s) => s.isUser) + 1} /{" "}
                                        {championship.standings.length}
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                      <div className="font-medium">Points</div>
                                      <div className="font-bold">
                                        {championship.standings.find((s) => s.isUser)?.points} pts
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="p-3 bg-[#15151e] rounded-lg border border-[#27272a] text-gray-400">
                                    You did not participate
                                  </div>
                                )}
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              className="w-full mt-4 border-[#27272a] text-white hover:bg-[#27272a]"
                              onClick={() => {
                                soundEffects.play("click")
                                router.push(`/championship/${championship.id}`)
                              }}
                            >
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>

                  <div className="flex justify-center">
                    <Button
                      className="bg-[#e10600] hover:bg-[#b30500] text-white font-bold px-6 py-2"
                      onClick={handleStartChampionship}
                    >
                      Start New Championship
                    </Button>
                  </div>
                </>
              ) : (
                <Card className="bg-[#1a1a24] border-[#27272a] text-white p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">No Completed Championships</h2>
                  <p className="mb-6 text-gray-400">
                    Complete a championship season to see your past achievements here.
                  </p>
                  <Button
                    className="bg-[#e10600] hover:bg-[#b30500] text-white font-bold px-6 py-2"
                    onClick={handleStartChampionship}
                  >
                    Start New Championship
                  </Button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  )
}
