# Combat System

## Overview
CIVIKA features a turn-based combat system that emphasizes strategic decision-making and character progression.

## Core Mechanics

### 1. Turn Order
- Initiative-based turn system
- Speed/Agility affects turn order
- Action points per turn
- Turn timers (optional)

### 2. Action Types
- **Basic Attack**: Standard physical attack
- **Abilities**: Special moves with cooldowns
- **Items**: Consumables and equipment
- **Defend**: Reduces incoming damage
- **Flee**: Attempt to escape combat

### 3. Combat Stats
- **Health (HP)**: When reduced to 0, character is incapacitated
- **Action Points (AP)**: Used to perform actions
- **Attack**: Base damage potential
- **Defense**: Reduces incoming damage
- **Speed**: Affects turn order and dodge chance
- **Critical Chance**: Probability of landing critical hits

## Combat Flow
1. **Engagement**: Combat begins when player encounters enemies
2. **Initiative**: Turn order is determined
3. **Player Phase**: Player selects actions for their party
4. **Enemy Phase**: AI controls enemy actions
5. **Resolution**: Effects are applied
6. **Repeat**: Until combat ends

## Technical Implementation

### 1. Data Structures
```typescript
interface Combatant {
  id: string;
  name: string;
  stats: {
    maxHp: number;
    currentHp: number;
    attack: number;
    defense: number;
    speed: number;
    criticalChance: number;
  };
  abilities: Ability[];
  statusEffects: StatusEffect[];
  team: 'player' | 'enemy';
  sprite: string;
}

interface Ability {
  id: string;
  name: string;
  description: string;
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'utility';
  target: 'self' | 'single' | 'all' | 'ally' | 'enemy';
  power: number;
  cost: number;
  cooldown: number;
  currentCooldown: number;
  animation: string;
}
```

### 2. Damage Calculation
```typescript
function calculateDamage(attacker: Combatant, defender: Combatant, ability: Ability): number {
  const baseDamage = attacker.stats.attack + ability.power;
  const defenseReduction = defender.stats.defense * 0.5; // Example formula
  const finalDamage = Math.max(1, baseDamage - defenseReduction);
  
  // Check for critical hit
  const isCritical = Math.random() < attacker.stats.criticalChance;
  return isCritical ? finalDamage * 1.5 : finalDamage;
}
```

## Status Effects

### 1. Types of Effects
- **Damage Over Time (Poison, Burn)**
- **Stat Modifiers (Buff/Debuff)**
- **Crowd Control (Stun, Silence, Root)**
- **Shield/Absorb**

### 2. Implementation
```typescript
interface StatusEffect {
  id: string;
  name: string;
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'control';
  statAffected?: 'attack' | 'defense' | 'speed' | 'criticalChance';
  modifier?: number; // Percentage or flat value
  duration: number; // In turns
  currentDuration: number;
  isStackable: boolean;
  maxStacks?: number;
  onTurnStart?: (target: Combatant) => void;
  onTurnEnd?: (target: Combatant) => void;
}
```

## AI System

### 1. Behavior Patterns
- **Aggressive**: Focuses on dealing damage
- **Defensive**: Prioritizes survival
- **Supportive**: Heals and buffs allies
- **Tactical**: Adapts to combat situation

### 2. Decision Making
```typescript
class EnemyAI {
  decideAction(combatant: Combatant, allies: Combatant[], enemies: Combatant[]): Action {
    // Simple example: Randomly select an ability and target
    const usableAbilities = combatant.abilities.filter(a => a.currentCooldown === 0);
    const ability = usableAbilities[Math.floor(Math.random() * usableAbilities.length)] || {
      type: 'basicAttack',
      target: 'single',
      power: combatant.stats.attack
    };
    
    let target;
    if (ability.target === 'enemy' || ability.type === 'basicAttack') {
      // Target random enemy
      target = enemies[Math.floor(Math.random() * enemies.length)];
    } else if (ability.target === 'ally') {
      // Target random ally (including self)
      const possibleTargets = [...allies, combatant];
      target = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
    }
    
    return { type: 'ability', ability, target };
  }
}
```

## UI/UX Considerations

### 1. Combat Interface
- Action selection panel
- Target selection UI
- Status effect indicators
- Turn order display
- Combat log

### 2. Visual Feedback
- Damage numbers
- Ability animations
- Status effect icons
- Health bars

## Best Practices
1. Balance numbers carefully
2. Provide clear feedback for all actions
3. Optimize for performance
4. Test edge cases (0 HP, multiple effects, etc.)
5. Ensure accessibility options
