# Dialogue System

## Overview
The dialogue system in CIVIKA manages all character interactions, from simple conversations to complex branching narratives with consequences.

## Core Features

### 1. Dialogue Types
- **Standard Dialogues**: Simple back-and-forth conversations
- **Branching Dialogues**: Player choices affect conversation flow
- **Conditional Dialogues**: Content changes based on game state
- **Quest Dialogues**: Special dialogues for quest-related interactions

### 2. Dialogue Components
- **Speaker Information**: Name, portrait, and mood
- **Text Display**: Formatted dialogue text
- **Player Choices**: Multiple response options
- **Effects**: Consequences of dialogue choices

## Technical Implementation

### 1. Data Structure
```typescript
interface DialogueNode {
  id: string;
  speaker: string; // NPC ID or 'PLAYER'
  text: string; // Can include variables like {playerName}
  choices: DialogueChoice[];
  conditions?: DialogueCondition[];
  effects?: DialogueEffect[];
  background?: string; // Background image
  music?: string; // Music track to play
  nextNode?: string; // Auto-advance to this node if no choices
}

interface DialogueChoice {
  text: string;
  nextNode: string; // ID of next node
  conditions?: DialogueCondition[];
  effects?: DialogueEffect[];
  skillCheck?: {
    skill: string;
    difficulty: number;
    successNode: string;
    failureNode: string;
  };
}

interface DialogueCondition {
  type: 'quest' | 'item' | 'stat' | 'flag' | 'reputation';
  // Quest conditions
  questId?: string;
  questState?: 'not_started' | 'in_progress' | 'completed' | 'failed';
  // Item conditions
  itemId?: string;
  hasItem?: boolean;
  // Stat conditions
  statName?: string;
  statValue?: number;
  comparison?: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
  // Flag conditions
  flagName?: string;
  flagValue?: any;
  // Reputation conditions
  factionId?: string;
  minReputation?: number;
  maxReputation?: number;
}

interface DialogueEffect {
  type: 'startQuest' | 'completeQuest' | 'addItem' | 'removeItem' | 'modifyStat' | 'setFlag' | 'modifyReputation' | 'unlockAbility';
  // Quest effects
  questId?: string;
  // Item effects
  itemId?: string;
  quantity?: number;
  // Stat effects
  statName?: string;
  statChange?: number;
  // Flag effects
  flagName?: string;
  flagValue?: any;
  // Reputation effects
  factionId?: string;
  reputationChange?: number;
  // Ability effects
  abilityId?: string;
}
```

### 2. Dialogue Manager
```typescript
class DialogueManager {
  private currentDialogue: DialogueNode | null = null;
  private dialogueHistory: string[] = [];
  
  startDialogue(dialogueId: string) {
    this.currentDialogue = this.loadDialogue(dialogueId);
    this.displayNode(this.currentDialogue);
  }
  
  selectChoice(choiceIndex: number) {
    if (!this.currentDialogue) return;
    
    const choice = this.currentDialogue.choices[choiceIndex];
    if (!choice) return;
    
    // Apply effects
    this.applyEffects(choice.effects);
    
    // Move to next node
    if (choice.nextNode) {
      this.currentDialogue = this.loadDialogue(choice.nextNode);
      this.displayNode(this.currentDialogue);
    } else {
      this.endDialogue();
    }
  }
  
  private applyEffects(effects?: DialogueEffect[]) {
    if (!effects) return;
    
    effects.forEach(effect => {
      switch (effect.type) {
        case 'startQuest':
          // Start quest logic
          break;
        case 'addItem':
          // Add item to inventory
          break;
        // Handle other effect types
      }
    });
  }
  
  private checkConditions(conditions?: DialogueCondition[]): boolean {
    if (!conditions) return true;
    
    return conditions.every(condition => {
      switch (condition.type) {
        case 'quest':
          // Check quest state
          break;
        case 'item':
          // Check if player has item
          break;
        // Handle other condition types
      }
      return true;
    });
  }
}
```

## Integration with Other Systems

### 1. Quest System
- Dialogue can start/complete quests
- Quest state affects available dialogue options
- NPCs react to quest progress

### 2. Inventory System
- Items can be given/received through dialogue
- Dialogue options can be gated by item possession

### 3. Character System
- Skills/stats can affect dialogue options
- Dialogue choices can affect reputation/relationships

## Best Practices

### 1. Writing Dialogue
- Keep text concise and engaging
- Make choices meaningful
- Consider character voice and personality
- Use variables for dynamic content

### 2. Technical Implementation
- Use a visual editor for complex dialogues
- Implement proper error handling
- Optimize for performance with large dialogue trees
- Support localization from the start

### 3. Testing
- Test all dialogue branches
- Verify conditions and effects
- Check for dead ends or loops
- Test with different game states

## Example Dialogue Flow

```yaml
- id: "greeting"
  speaker: "shopkeeper"
  text: "Welcome to my shop, {playerName}! What can I do for you today?"
  choices:
    - text: "What do you have for sale?"
      nextNode: "shop_inventory"
    - text: "I'm looking for information."
      nextNode: "info_request"
      conditions:
        - type: "quest"
          questId: "find_lost_ring"
          questState: "in_progress"
    - text: "Never mind."
      nextNode: "goodbye"

- id: "shop_inventory"
  speaker: "shopkeeper"
  text: "I've got all sorts of useful items. Take a look!"
  effects:
    - type: "openShop"
      shopId: "general_store"
  nextNode: "anything_else"
```

## Localization Support
- Store all text in external files
- Support right-to-left languages
- Handle text expansion/contraction
- Consider cultural context
