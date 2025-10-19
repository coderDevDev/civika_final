# Save System

## Overview
The save system in CIVIKA handles the persistence of game state, allowing players to save their progress and return to it later.

## Core Features

### 1. Save Slots
- Multiple save slots (3-5 slots by default)
- Auto-save functionality
- Quick save/load
- Save slot metadata (screenshot, playtime, etc.)

### 2. Saved Data
- Player state (position, stats, inventory)
- Quest progress
- World state (NPCs, objects, events)
- Game settings
- Timestamp and playtime

## Technical Implementation

### 1. Data Structure
```typescript
interface SaveData {
  // Metadata
  version: string;
  timestamp: number;
  playtime: number; // in seconds
  screenshot: string; // base64 encoded thumbnail
  
  // Game state
  player: {
    id: string;
    name: string;
    position: {
      x: number;
      y: number;
      map: string;
    };
    stats: Record<string, number>;
    inventory: Array<{
      itemId: string;
      quantity: number;
      isEquipped: boolean;
    }>;
    equipment: Record<string, string | null>;
    abilities: string[];
    level: number;
    experience: number;
  };
  
  // Quest state
  quests: Array<{
    id: string;
    state: 'not_started' | 'in_progress' | 'completed' | 'failed';
    currentStep: number;
    objectives: Array<{
      id: string;
      completed: boolean;
      progress: number;
    }>;
  }>;
  
  // World state
  world: {
    flags: Record<string, any>;
    npcStates: Record<string, {
      position?: { x: number, y: number };
      state: string;
      variables: Record<string, any>;
    }>;
    discoveredAreas: string[];
    timeOfDay: number;
    weather: string;
  };
  
  // Settings
  settings: {
    audio: {
      masterVolume: number;
      musicVolume: number;
      effectsVolume: number;
      voiceVolume: number;
    };
    video: {
      resolution: string;
      fullscreen: boolean;
      vSync: boolean;
      quality: 'low' | 'medium' | 'high' | 'ultra';
    };
    controls: {
      keybinds: Record<string, string>;
      mouseSensitivity: number;
      invertY: boolean;
    };
    accessibility: {
      textSize: number;
      colorBlindMode: string;
      subtitles: boolean;
      subtitleSize: number;
    };
  };
}
```

### 2. Save Manager
```typescript
class SaveManager {
  private static SAVE_PREFIX = 'civika_save_';
  private static AUTO_SAVE_KEY = 'civika_autosave';
  private static SETTINGS_KEY = 'civika_settings';
  
  // Save game to a specific slot
  static saveGame(slot: number, data: SaveData): boolean {
    try {
      const saveData = {
        ...data,
        timestamp: Date.now(),
        version: GAME_VERSION,
      };
      
      // Capture screenshot if in-game
      if (game.scene.isActive('GameScene')) {
        saveData.screenshot = this.captureScreenshot();
      }
      
      const key = `${this.SAVE_PREFIX}${slot}`;
      localStorage.setItem(key, JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }
  
  // Load game from a specific slot
  static loadGame(slot: number): SaveData | null {
    try {
      const key = `${this.SAVE_PREFIX}${slot}`;
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      const saveData = JSON.parse(data);
      
      // Handle save version migration if needed
      if (this.needsMigration(saveData.version)) {
        return this.migrateSave(saveData);
      }
      
      return saveData;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }
  
  // Delete a save file
  static deleteSave(slot: number): boolean {
    try {
      const key = `${this.SAVE_PREFIX}${slot}`;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to delete save:', error);
      return false;
    }
  }
  
  // Get list of all save files with metadata
  static listSaves(): Array<{
    slot: number;
    timestamp: number;
    playtime: number;
    playerName: string;
    level: number;
    screenshot?: string;
  }> {
    const saves: any[] = [];
    
    for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
      const key = `${this.SAVE_PREFIX}${i}`;
      const data = localStorage.getItem(key);
      
      if (data) {
        try {
          const save = JSON.parse(data);
          saves.push({
            slot: i,
            timestamp: save.timestamp,
            playtime: save.playtime || 0,
            playerName: save.player?.name || 'Unknown',
            level: save.player?.level || 1,
            screenshot: save.screenshot
          });
        } catch (error) {
          console.error(`Error parsing save slot ${i}:`, error);
        }
      }
    }
    
    return saves;
  }
  
  // Auto-save the current game
  static autoSave(gameState: any): boolean {
    try {
      const saveData = this.prepareSaveData(gameState);
      localStorage.setItem(this.AUTO_SAVE_KEY, JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error('Auto-save failed:', error);
      return false;
    }
  }
  
  // Load auto-saved game
  static loadAutoSave(): SaveData | null {
    try {
      const data = localStorage.getItem(this.AUTO_SAVE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load auto-save:', error);
      return null;
    }
  }
  
  // Save game settings
  static saveSettings(settings: any): boolean {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }
  
  // Load game settings
  static loadSettings(): any {
    try {
      const data = localStorage.getItem(this.SETTINGS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return null;
    }
  }
  
  private static captureScreenshot(): string {
    // Implementation for capturing game screenshot
    // Returns base64 encoded image
    return '';
  }
  
  private static needsMigration(version: string): boolean {
    // Implementation for version checking
    return false;
  }
  
  private static migrateSave(oldData: any): SaveData {
    // Implementation for migrating old save data to new format
    return oldData as SaveData;
  }
}
```

## Best Practices

### 1. Performance
- Save game state at appropriate checkpoints
- Use compression for large data (e.g., screenshots)
- Implement incremental saves for large worlds

### 2. Error Handling
- Validate save data on load
- Handle corrupted saves gracefully
- Provide backup/restore functionality

### 3. Security
- Sanitize all loaded data
- Consider encryption for sensitive information
- Be cautious with user-generated content

### 4. User Experience
- Show save/load progress
- Provide visual feedback
- Allow for multiple save slots
- Include auto-save functionality

## Integration with Game Systems

### 1. Game State Management
- Serialize/deserialize game state
- Handle object references
- Manage scene transitions

### 2. UI Integration
- Save/load menu
- Save slot management
- Confirmation dialogs

### 3. Cloud Saving (Future)
- User authentication
- Conflict resolution
- Offline support

## Example Usage
```typescript
// Saving the game
const saveData = {
  player: {
    id: 'player1',
    name: 'Hero',
    position: { x: 100, y: 200, map: 'town' },
    stats: { health: 100, mana: 50 },
    inventory: [{ itemId: 'health_potion', quantity: 3, isEquipped: false }],
    equipment: { weapon: 'iron_sword', armor: 'leather_armor' },
    abilities: ['fireball', 'heal'],
    level: 5,
    experience: 1250
  },
  // ... other save data
};

// Save to slot 1
const saved = SaveManager.saveGame(1, saveData);
if (saved) {
  showMessage('Game saved successfully!');
}

// Loading a game
const loadedData = SaveManager.loadGame(1);
if (loadedData) {
  // Apply loaded data to game state
  loadGameState(loadedData);
}

// Auto-save
function onCheckpointReached() {
  const gameState = getCurrentGameState();
  SaveManager.autoSave(gameState);
}

// List all saves
const saves = SaveManager.listSaves();
saves.forEach(save => {
  console.log(`Slot ${save.slot}: ${save.playerName} (Level ${save.level})`);
});
```
