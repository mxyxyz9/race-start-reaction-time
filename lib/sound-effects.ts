class SoundEffects {
  private sounds: Record<string, HTMLAudioElement> = {}
  private muted = false

  constructor() {
    if (typeof window !== "undefined") {
      // Load sounds
      this.sounds = {
        countdown: new Audio("/sounds/countdown.mp3"),
        lightOn: new Audio("/sounds/light-on.mp3"),
        lightsOut: new Audio("/sounds/lights-out.mp3"),
        engineRev: new Audio("/sounds/engine-rev.mp3"),
        jumpStart: new Audio("/sounds/jump-start.mp3"),
        finish: new Audio("/sounds/finish.mp3"),
        click: new Audio("/sounds/click.mp3"),
      }

      // Initialize from localStorage
      const savedMuted = localStorage.getItem("soundMuted")
      this.muted = savedMuted === "true"
    }
  }

  play(soundName: string): void {
    if (this.muted || !this.sounds[soundName]) return

    // Stop and reset the sound before playing
    const sound = this.sounds[soundName]
    sound.currentTime = 0

    // Play the sound
    sound.play().catch((err) => {
      console.warn(`Error playing sound ${soundName}:`, err)
    })
  }

  toggleMute(): boolean {
    this.muted = !this.muted

    if (typeof window !== "undefined") {
      localStorage.setItem("soundMuted", this.muted.toString())
    }

    return this.muted
  }

  isMuted(): boolean {
    return this.muted
  }
}

// Create a singleton instance
const soundEffects = new SoundEffects()
export default soundEffects
