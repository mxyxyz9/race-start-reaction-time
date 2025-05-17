import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import SiteHeader from "@/components/site-header"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="container max-w-4xl">
          <Card className="bg-[#1a1a24] border-[#27272a] text-white overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#e10600] to-transparent opacity-10"></div>
              <CardHeader className="relative">
                <CardTitle className="text-3xl md:text-5xl text-center text-[#e10600]">
                  F1 Race Start Reaction Test
                </CardTitle>
                <CardDescription className="text-center text-gray-400 text-lg mt-2">
                  Test your reaction time against F1 drivers
                </CardDescription>
              </CardHeader>
            </div>
            <CardContent className="space-y-8 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg bg-[#15151e] p-6 border border-[#27272a]">
                  <h3 className="mb-4 text-xl font-semibold flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-[#e10600]"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    How It Works
                  </h3>
                  <ul className="space-y-2 list-disc pl-5 text-gray-300">
                    <li>Five red lights will illuminate one by one, just like in a real F1 race</li>
                    <li>After a random delay, all lights will go out - that's your signal to GO!</li>
                    <li>Click or tap as quickly as possible when the lights go out</li>
                    <li>Be careful! If you jump the start, you'll be penalized</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-[#15151e] p-6 border border-[#27272a]">
                  <h3 className="mb-4 text-xl font-semibold flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-[#e10600]"
                    >
                      <path d="M12 8c-2.8 0-5 2.2-5 5 0 2.8 2.2 5 5 5 2.8 0 5-2.2 5-5 0-2.8-2.2-5-5-5z"></path>
                      <path d="M12 3v2"></path>
                      <path d="M19 12h2"></path>
                      <path d="M12 19v2"></path>
                      <path d="M3 12h2"></path>
                    </svg>
                    Features
                  </h3>
                  <ul className="space-y-2 list-disc pl-5 text-gray-300">
                    <li>Compete against AI drivers with realistic reaction times</li>
                    <li>Multiple difficulty levels to test your skills</li>
                    <li>Championship mode with multiple races</li>
                    <li>Race visualization with animated cars</li>
                    <li>Detailed statistics to track your performance</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                  <Link href="/game" className="w-full">
                    <Button
                      size="lg"
                      className="bg-[#e10600] hover:bg-[#b30500] text-white font-bold w-full py-6 text-lg"
                    >
                      Quick Race
                    </Button>
                  </Link>
                  <Link href="/championship" className="w-full">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-[#e10600] text-white hover:bg-[#27272a] w-full py-6 text-lg"
                    >
                      Championship
                    </Button>
                  </Link>
                </div>
                <p className="text-gray-400 text-sm">
                  Did you know? The average F1 driver reaction time is around 0.2-0.3 seconds
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-gray-400 border-t border-[#27272a] p-6">
              <p>Choose from multiple difficulty levels</p>
              <p>Realistic F1 start procedure</p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  )
}
