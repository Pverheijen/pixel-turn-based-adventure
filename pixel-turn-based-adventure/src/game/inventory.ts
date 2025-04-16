export const itemQualities = ['Normal', 'Unique', 'Rare', 'Legendary'] as const;
export type ItemQuality = typeof itemQualities[number];

export type ItemSlot =
  | 'weapon1' | 'weapon2' | 'chest' | 'head' | 'pants'
  | 'feet' | 'gloves' | 'ring' | 'necklace' | 'cape';

export type ItemSet = 'Ninja' | 'Warrior' | 'Mage' | 'Ranger' | 'Soldier';

export interface Item {
  name: string;
  slot: ItemSlot;
  set: ItemSet;
  quality: ItemQuality;
  stats: { attack: number; defense: number; life: number };
  equipped?: boolean;
}

export const defaultInventory: Item[] = [];

export const setBonuses: Record<ItemSet, Record<number, { attack: number; defense: number; life: number }>> = {
  Ninja: {
    2: { attack: 3, defense: 0, life: 0 },
    4: { attack: 6, defense: 1, life: 5 },
    6: { attack: 10, defense: 2, life: 10 },
  },
  Warrior: {
    2: { attack: 2, defense: 3, life: 5 },
    4: { attack: 4, defense: 6, life: 10 },
    6: { attack: 6, defense: 10, life: 20 },
  },
  Mage: {
    2: { attack: 5, defense: 1, life: 5 },
    4: { attack: 9, defense: 2, life: 10 },
    6: { attack: 15, defense: 3, life: 15 },
  },
  Ranger: {
    2: { attack: 3, defense: 1, life: 3 },
    4: { attack: 7, defense: 2, life: 8 },
    6: { attack: 12, defense: 3, life: 12 },
  },
  Soldier: {
    2: { attack: 2, defense: 4, life: 4 },
    4: { attack: 4, defense: 8, life: 10 },
    6: { attack: 6, defense: 12, life: 16 },
  },
};
