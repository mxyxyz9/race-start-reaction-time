"use client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import type { Difficulty } from "@/lib/types"

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty
  onChange: (difficulty: Difficulty) => void
  className?: string
}

export default function DifficultySelector({ selectedDifficulty, onChange, className }: DifficultySelectorProps) {
  const difficulties: { value: Difficulty; label: string; description: string }[] = [
    {
      value: "easy",
      label: "Easy",
      description: "AI reaction times: 0.30-0.50s • Longer light sequence",
    },
    {
      value: "medium",
      label: "Medium",
      description: "AI reaction times: 0.22-0.35s • Standard light sequence",
    },
    {
      value: "hard",
      label: "Hard",
      description: "AI reaction times: 0.18-0.28s • Shorter light sequence",
    },
  ]

  return (
    <div className={cn("space-y-4", className)}>
      <RadioGroup
        value={selectedDifficulty}
        onValueChange={(value) => onChange(value as Difficulty)}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {difficulties.map((difficulty) => (
          <div key={difficulty.value} className="relative">
            <RadioGroupItem
              value={difficulty.value}
              id={difficulty.value}
              className="peer sr-only"
              aria-label={difficulty.label}
            />
            <Label
              htmlFor={difficulty.value}
              className={cn(
                "flex flex-col items-center justify-between rounded-lg border-2 border-[#27272a] bg-[#15151e] p-4 hover:bg-[#1a1a24] hover:border-[#e10600] cursor-pointer transition-all",
                "peer-data-[state=checked]:border-[#e10600] peer-data-[state=checked]:bg-[#1a1a24]",
              )}
            >
              <div className="mb-2 text-center">
                <h3 className="text-xl font-bold">{difficulty.label}</h3>
                <p className="text-sm text-gray-400 mt-1">{difficulty.description}</p>
              </div>
              {selectedDifficulty === difficulty.value && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#e10600] rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
