"use client"

import { useState } from "react"
import { GameModal } from "@/components/game-modal"
import { GameButton, GameCheckbox, GameSlider, GameToggle, GameMap } from "@/components/game-ui-elements"

export default function HomePage() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  // Settings state
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [volume, setVolume] = useState(75)

  // Options state
  const [autoSave, setAutoSave] = useState(true)
  const [showTutorials, setShowTutorials] = useState(true)
  const [difficulty, setDifficulty] = useState(50)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-foreground mb-8">Medieval Game UI Components</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GameButton onClick={() => setActiveModal("settings")}>Settings</GameButton>
          <GameButton variant="orange" onClick={() => setActiveModal("options")}>
            Options
          </GameButton>
          <GameButton variant="yellow" onClick={() => setActiveModal("menu")}>
            Menu
          </GameButton>
          <GameButton variant="green" onClick={() => setActiveModal("adventure")}>
            Adventure
          </GameButton>
        </div>

        {/* Settings Modal */}
        <GameModal isOpen={activeModal === "settings"} onClose={() => setActiveModal(null)} title="SETTINGS">
          <div className="space-y-4">
            <GameToggle enabled={soundEnabled} onChange={setSoundEnabled} label="Sound Effects" />
            <GameToggle enabled={musicEnabled} onChange={setMusicEnabled} label="Background Music" />
            <GameSlider value={volume} onChange={setVolume} label="Master Volume" />
            <GameCheckbox
              checked={notificationsEnabled}
              onChange={setNotificationsEnabled}
              label="Push Notifications"
            />
          </div>
        </GameModal>

        {/* Options Modal */}
        <GameModal isOpen={activeModal === "options"} onClose={() => setActiveModal(null)} title="OPTIONS">
          <div className="space-y-4">
            <GameToggle enabled={autoSave} onChange={setAutoSave} label="Auto Save" />
            <GameToggle enabled={showTutorials} onChange={setShowTutorials} label="Show Tutorials" />
            <GameSlider value={difficulty} onChange={setDifficulty} label="Difficulty Level" />
          </div>
        </GameModal>

        {/* Menu Modal */}
        <GameModal
          isOpen={activeModal === "menu"}
          onClose={() => setActiveModal(null)}
          title="MENU"
          className="max-w-sm"
        >
          <div className="space-y-3">
            <GameButton variant="red" className="w-full">
              New Game
            </GameButton>
            <GameButton variant="orange" className="w-full">
              Load Game
            </GameButton>
            <GameButton variant="yellow" className="w-full">
              Save Game
            </GameButton>
            <GameButton variant="green" className="w-full">
              Inventory
            </GameButton>
            <GameButton variant="blue" className="w-full">
              Quit Game
            </GameButton>
          </div>
        </GameModal>

        {/* Adventure Modal */}
        <GameModal isOpen={activeModal === "adventure"} onClose={() => setActiveModal(null)} title="ADVENTURE">
          <div className="space-y-4">
            <p className="text-sm text-card-foreground/80 text-center">Choose your destination</p>
            <GameMap />
            <div className="flex justify-center">
              <GameButton variant="green">Begin Journey</GameButton>
            </div>
          </div>
        </GameModal>

        {/* Demo Content */}
        <div className="mt-12 text-center text-foreground/60">
          <p>Click the buttons above to see the medieval game-style modals in action!</p>
        </div>
      </div>
    </div>
  )
}
