import { cn } from "@/lib/utils"

interface StartingLightsProps {
  lightCount: number
}

export default function StartingLights({ lightCount }: StartingLightsProps) {
  // Create an array of 5 lights
  const lights = Array.from({ length: 5 }, (_, i) => i < lightCount)

  return (
    <div className="flex flex-col items-center">
      <div className="bg-[#1a1a24] border border-[#27272a] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-center space-x-4 mb-2">
          {lights.map((isOn, index) => (
            <div
              key={index}
              className={cn(
                "w-16 h-16 rounded-full border-4 border-gray-700 transition-colors duration-300",
                isOn ? "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.7)]" : "bg-gray-800",
              )}
              aria-label={isOn ? "Red light on" : "Light off"}
            />
          ))}
        </div>
        <div className="h-4 bg-[#27272a] w-full mt-2 rounded-full" />
      </div>
      <div className="mt-4 text-center">
        {lightCount === 0 && <p className="text-xl">Waiting for lights...</p>}
        {lightCount > 0 && lightCount < 5 && (
          <p className="text-xl">
            {lightCount} light{lightCount > 1 ? "s" : ""} on
          </p>
        )}
        {lightCount === 5 && <p className="text-xl text-red-500 font-bold">WAIT FOR LIGHTS OUT</p>}
      </div>
    </div>
  )
}
