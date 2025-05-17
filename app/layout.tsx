import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { GameProvider } from "@/lib/game-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "F1 Reaction Time Test",
  description: "Test your reaction time against F1 drivers with this realistic F1 race start simulator",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GameProvider>
          <div className="min-h-screen flex flex-col bg-[#15151e] text-white">{children}</div>
          <Toaster />
        </GameProvider>
      </body>
    </html>
  )
}
