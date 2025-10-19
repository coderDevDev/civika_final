# Inventory System

## Overview
The inventory system manages all items that the player can collect, equip, and use throughout the game.

## Core Features

### 1. Item Types
- **Weapons**: Melee, ranged, and magical weapons
- **Armor**: Head, chest, legs, feet, and accessory slots
- **Consumables**: Health potions, buffs, and other one-time use items
- **Quest Items**: Key items required for quests
- **Materials**: Crafting components
- **Keys**: For opening doors/chests

### 2. Inventory Management
- Limited inventory capacity
- Sorting and filtering
- Quick slots for frequently used items
- Item stacking

## Technical Implementation

### 1. Data Structures
```typescript
interface Item {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'consumable' | 'quest' | 'material' | 'key';
  icon: string;
  maxStack: number;
  value: number;
  weight: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  // Type-specific properties
  weaponStats?: {
    damage: number;
    attackSpeed: number;
    range: number;
    weaponType: 'sword' | 'axe' | 'staff' | 'bow' | 'dagger';
  };
  armorStats?: {
    defense: number;
    slot: 'head' | 'chest' | 'legs' | 'feet' | 'accessory';
    resistance?: {
      fire?: number;
      ice?: number;
      lightning?: number;
      // Additional resistances
    };
  };
  consumableEffect?: {
    type: 'heal' | 'buff' | 'teleport' | 'summon';
    power: number;
    duration?: number; // For buffs
    target: 'self' | 'ally' | 'enemy' | 'area';
  };
  questData?: {
    questId: string;
    isKeyItem: boolean;
  };
  craftingData?: {
    materials: Array<{itemId: string, quantity: number}>;
    skillRequired?: string;
    skillLevel?: number;
  };
}

interface Inventory {
  items: Array<{
    item: Item;
    quantity: number;
    isEquipped: boolean;
  }>;
  maxSlots: number;
  currentWeight: number;
  maxWeight: number;
  equippedItems: {
    [key in 'weapon' | 'head' | 'chest' | 'legs' | 'feet' | 'accessory1' | 'accessory2']?: Item;
  };
}
```

### 2. Core Functions
```typescript
class InventoryManager {
  private inventory: Inventory;
  
  addItem(itemId: string, quantity: number = 1): boolean {
    // Implementation for adding items
  }
  
  removeItem(itemId: string, quantity: number = 1): boolean {
    // Implementation for removing items
  }
  
  equipItem(itemId: string, slot?: string): boolean {
    // Implementation for equipping items
  }
  
  unequipItem(slot: string): boolean {
    // Implementation for unequipping items
  }
  
  useItem(itemId: string, target?: any): boolean {
    // Implementation for using consumables
  }
  
  private updateStats() {
    // Recalculate player stats based on equipped items
  }
}
```

## UI/UX Considerations

### 1. Inventory Screen
- Grid-based layout
- Item tooltips
- Category tabs
- Sort/filter options
- Weight/capacity display

### 2. Item Tooltip
- Item name and icon
- Rarity color coding
- Description
- Stats and effects
- Value and weight
- Required level/attributes

## Integration with Other Systems

### 1. Character System
- Stat modifications from equipped items
- Level/attribute requirements
- Skill bonuses

### 2. Quest System
- Quest item tracking
- Item rewards
- Required items for quests

### 3. Crafting System
- Material requirements
- Recipe unlocking
- Crafting skill progression

## Best Practices

### 1. Performance
- Use object pooling for inventory UI elements
- Lazy load item icons
- Cache frequently accessed data

### 2. Data Management
- Use unique IDs for all items
- Implement proper save/load functionality
- Handle edge cases (full inventory, etc.)

### 3. Balancing
- Carefully tune item stats
- Consider progression curve
- Test with different playstyles

## Example Usage
```typescript
// Adding an item to inventory
const success = inventoryManager.addItem('health_potion', 3);
if (!success) {
  showMessage('Inventory is full!');
}

// Equipping an item
const equipped = inventoryManager.equipItem('iron_sword');
if (equipped) {
  playSound('equip_weapon');
  updateCharacterStats();
}

// Using a consumable
const used = inventoryManager.useItem('health_potion', player);
if (used) {
  showFloatingText('+50 HP', player.position, 'heal');
}
```
