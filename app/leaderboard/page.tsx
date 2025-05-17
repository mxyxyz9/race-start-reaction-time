"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGameContext } from "@/lib/game-context"
import SiteHeader from "@/components/site-header"
import StatisticsCard from "@/components/statistics-card"
import { formatDate } from "@/lib/utils"
import soundEffects from "@/lib/sound-effects"

export default function LeaderboardPage() {
  const { reactionTimes, clearReactionTimes, bestTime } = useGameContext()
  const [activeTab, setActiveTab] = useState("all")

  // Filter times based on active tab
  const filteredTimes =
    activeTab === "all" ? reactionTimes : reactionTimes.filter((time) => time.difficulty === activeTab)

  // Calculate average time
  const averageTime =
    filteredTimes.length > 0 ? filteredTimes.reduce((sum, record) => sum + record.time, 0) / filteredTimes.length : null

  return (
    <>
      <SiteHeader />
      <main className="flex-1 p-4">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center my-6">Your Performance Stats</h1>

          <div className="grid grid-cols-1 gap-6 mb-6">
            <StatisticsCard />

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
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <line x1="3" x2="21" y1="9" y2="9"></line>
                    <line x1="3" x2="21" y1="15" y2="15"></line>
                    <line x1="9" x2="9" y1="3" y2="21"></line>
                    <line x1="15" x2="15" y1="3" y2="21"></line>
                  </svg>
                  Reaction Time History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="easy">Easy</TabsTrigger>
                    <TabsTrigger value="medium">Medium</TabsTrigger>
                    <TabsTrigger value="hard">Hard</TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab} className="mt-0">
                    {filteredTimes.length > 0 ? (
                      <div className="rounded-md border border-[#27272a] overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-[#27272a] hover:bg-[#1a1a24]">
                              <TableHead className="text-gray-300 w-16">#</TableHead>
                              <TableHead className="text-gray-300">Date</TableHead>
                              <TableHead className="text-gray-300">Difficulty</TableHead>
                              <TableHead className="text-gray-300 text-right">Time</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredTimes.map((record, index) => (
                              <TableRow key={index} className="border-[#27272a] hover:bg-[#1a1a24]">
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{formatDate(record.date)}</TableCell>
                                <TableCell className="capitalize">{record.difficulty}</TableCell>
                                <TableCell className="text-right font-bold tabular-nums">
                                  {record.time.toFixed(3)}s
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center py-8 border border-[#27272a] rounded-md">
                        No reaction times recorded yet
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <Button
                    variant="outline"
                    className="border-[#27272a] text-white hover:bg-[#27272a]"
                    onClick={() => {
                      soundEffects.play("click")
                      clearReactionTimes()
                    }}
                    disabled={reactionTimes.length === 0}
                  >
                    Clear History
                  </Button>
                  <Link href="/game">
                    <Button
                      className="bg-[#e10600] hover:bg-[#b30500] w-full sm:w-auto"
                      onClick={() => soundEffects.play("click")}
                    >
                      Try Again
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
