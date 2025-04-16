import Phaser from 'phaser';
import {
  Item,
  ItemSlot,
  ItemSet,
  ItemQuality,
  itemQualities,
  defaultInventory,
  setBonuses
} from './inventory';

export class GameScene extends Phaser.Scene {
  private baseStats = { attack: 10, defense: 10, life: 100 };
  private stats = { ...this.baseStats };
  private enemyLife = 0;
  private currentStage = 1;
  private inventory: Item[] = [];
  private equippedItems: Record<ItemSlot, Item | null> = {
    weapon1: null, weapon2: null, chest: null, head: null,
    pants: null, feet: null, gloves: null,
    ring: null, necklace: null, cape: null
  };

  private enemyTypes = [
    { name: 'Slime', emoji: '🟢', baseHP: 30, baseAttack: 5 },
    { name: 'Goblin', emoji: '🪓', baseHP: 45, baseAttack: 8 },
    { name: 'Wolf', emoji: '🐺', baseHP: 60, baseAttack: 10 },
    { name: 'Skeleton', emoji: '💀', baseHP: 75, baseAttack: 12 },
    { name: 'Orc', emoji: '🧟', baseHP: 100, baseAttack: 15 },
    { name: 'Witch', emoji: '🧙', baseHP: 120, baseAttack: 18 },
    { name: 'Dragonling', emoji: '🐉', baseHP: 140, baseAttack: 22 },
    { name: 'Golem', emoji: '🪨', baseHP: 160, baseAttack: 25 },
    { name: 'Demon', emoji: '😈', baseHP: 180, baseAttack: 28 },
    { name: 'Boss Dragon', emoji: '🔥🐉🔥', baseHP: 250, baseAttack: 35 },
  ];
  private currentEnemy = this.enemyTypes[0];

  private slotIcons: Partial<Record<ItemSlot, string>> = {
    head: '🪖', chest: '🧥', pants: '👖', feet: '🥾', gloves: '🧤',
    weapon1: '🗡', weapon2: '🗡', ring: '💍', necklace: '📿', cape: '🧣',
  };

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor('#222');

    const charClass = localStorage.getItem('selectedCharacter') || 'Knight';
    const classStats = {
      Knight: { attack: 10, defense: 15, life: 120 },
      Mage: { attack: 15, defense: 5, life: 90 },
      Rogue: { attack: 12, defense: 8, life: 100 },
    };

    this.baseStats = classStats[charClass as keyof typeof classStats];
    this.stats = { ...this.baseStats };

    this.startStage(this.currentStage);
  }

  private startStage(stage: number) {
    const enemy = this.enemyTypes[Math.min(stage - 1, this.enemyTypes.length - 1)];
    this.currentEnemy = enemy;
    this.enemyLife = enemy.baseHP;
    this.renderUI();
  }

  private renderUI() {
    this.children.removeAll();
    this.renderStageCounter();
    this.renderEquippedItems();
    this.renderInventoryItems();
    this.renderStats();
    this.renderEnemy();
    this.renderAttackButton();
  }

  private renderStageCounter() {
    this.add.text(500, 20, `📜 Stage ${this.currentStage} / 10`, {
      font: '18px Arial',
      color: '#ffffcc'
    }).setOrigin(0.5);
  }
  // start
  private renderEquippedItems() {
    const grid: [ItemSlot, number, number][] = [
      ['head', 0, 0], ['necklace', 1, 0],
      ['chest', 0, 1], ['cape', 1, 1],
      ['weapon1', 0, 2], ['gloves', 1, 2], ['weapon2', 2, 2],
      ['pants', 0, 3], ['feet', 1, 3], ['ring', 2, 3]
    ];
  
    const slotSize = 100;
    const startX = 20;
    const startY = 60;
  
    this.add.text(startX, 30, '🧍 Equipped', { font: '16px Arial', color: '#ffffff' });
  
    grid.forEach(([slot, col, row]) => {
      const item = this.equippedItems[slot];
      const icon = this.slotIcons[slot] || '❓';
      const x = startX + col * slotSize;
      const y = startY + row * 70;
  
      const zone = this.add.zone(x, y, 150, 40).setRectangleDropZone(150, 40);
      zone.setData('slot', slot);
      zone.setInteractive();
  
      const label = this.add.text(x, y, item
        ? `${icon} ${item.name}`
        : `${icon} ⬜ empty`, {
        font: '14px Arial',
        color: item ? '#0f0' : '#555'
      });
  
      zone.on('pointerover', () => {
        label.setStyle({ color: '#ffff00' });
      });
  
      zone.on('pointerout', () => {
        label.setStyle({ color: item ? '#0f0' : '#555' });
      });
    });
  
    // ✅ Attach drop event ONCE, outside the loop
    this.input.once('drop', (_pointer, dropped, zone) => {
      const slot = zone.getData('slot') as ItemSlot;
      const item = dropped.getData('item') as Item;
  
      if (!item || !slot) return;
  
      if ((item.slot === 'weapon1' || item.slot === 'weapon2') &&
          slot !== 'weapon1' && slot !== 'weapon2') {
        return; // weapon dropped in wrong slot
      }
  
      this.equipItemToSlot(item, slot);
      this.renderUI();
    });
  }

  private renderInventoryItems() {
    const x = 260;
    const baseY = 400;
    const unequipped = this.inventory.filter(i => !i.equipped);

    this.add.text(x, baseY, '🎒 Inventory:', { font: '16px Arial', color: '#fff' });

    unequipped.forEach((item, i) => {
      const y = baseY + 30 + i * 40;
    
      const itemText = this.add.text(x, y, `${item.name} (${item.quality})`, {
        font: '14px Arial',
        color: '#ccc',
        backgroundColor: '#000000'
      })
        .setInteractive({ draggable: true, useHandCursor: true });
    
      itemText.setData('item', item);
    
      itemText.on('dragstart', () => itemText.setAlpha(0.5));
      itemText.on('dragend', () => itemText.setAlpha(1));
    
      this.input.setDraggable(itemText);
    
      this.add.text(x + 20, y + 16, `⚔️ ${item.stats.attack} 🛡 ${item.stats.defense} ❤️ ${item.stats.life}`, {
        font: '12px Arial',
        color: '#aaa'
      });
    });
    
  }
 // test
  private equipItemToSlot(item: Item, slot: ItemSlot) {
    if (this.equippedItems[slot]) {
      this.equippedItems[slot]!.equipped = false;
    }
  
    item.equipped = true;
    this.equippedItems[slot] = item;
  }

  private promptWeaponSlotChoice(item: Item) {
    const w1 = this.equippedItems.weapon1;
    const w2 = this.equippedItems.weapon2;

    const choice = prompt(
      `Both weapon slots are occupied.\nChoose a slot to replace:\n` +
      `1. 🗡 weapon1 (${w1?.name || 'empty'}) ⚔️${w1?.stats.attack} 🛡${w1?.stats.defense} ❤️${w1?.stats.life}\n` +
      `2. 🗡 weapon2 (${w2?.name || 'empty'}) ⚔️${w2?.stats.attack} 🛡${w2?.stats.defense} ❤️${w2?.stats.life}`
    );

    const selected = parseInt(choice || '1', 10) === 2 ? 'weapon2' : 'weapon1';

    if (this.equippedItems[selected]) {
      this.equippedItems[selected]!.equipped = false;
    }

    item.equipped = true;
    this.equippedItems[selected] = item;
    this.renderUI();
  }
  private handleAttack() {
    this.enemyLife -= this.stats.attack;

    if (this.enemyLife <= 0) {
      this.stageClear();
      return;
    }

    this.stats.life -= this.currentEnemy.baseAttack;
    if (this.stats.life <= 0) {
      alert('You died!');
      this.scene.start('MainMenuScene');
      return;
    }

    this.renderUI();
  }

  private stageClear() {
    if (this.currentStage >= 10) {
      this.scene.start('VictoryScene');
      return;
    }

    const drops = this.generateItems(3);

    const pick = prompt(
      `Choose item:\n${drops.map((item, i) =>
        `${i + 1}. ${item.name} [${item.slot}] (${item.quality})\n` +
        `   ⚔️ ${item.stats.attack} 🛡 ${item.stats.defense} ❤️ ${item.stats.life}`
      ).join('\n\n')}`
    );

    const selected = drops[parseInt(pick || '1', 10) - 1];
    if (selected) this.inventory.push(selected);

    this.currentStage++;
    this.startStage(this.currentStage);
  }

  private renderStats() {
    const x = 700;
    const y = 20;

    this.updateStats();

    this.add.text(x, y, '📊 Stats', { font: '18px Arial', color: '#ffffff' });
    this.add.text(x, y + 30, `⚔️ Attack: ${this.stats.attack}`, { font: '14px Arial', color: '#ccc' });
    this.add.text(x, y + 50, `🛡 Defense: ${this.stats.defense}`, { font: '14px Arial', color: '#ccc' });
    this.add.text(x, y + 70, `❤️ Life: ${this.stats.life}`, { font: '14px Arial', color: '#ccc' });
  }

  private updateStats() {
    this.stats = { ...this.baseStats };
    const setCounts: Partial<Record<ItemSet, number>> = {};

    Object.values(this.equippedItems).forEach(item => {
      if (item) {
        this.stats.attack += item.stats.attack;
        this.stats.defense += item.stats.defense;
        this.stats.life += item.stats.life;
        setCounts[item.set] = (setCounts[item.set] || 0) + 1;
      }
    });

    Object.entries(setCounts).forEach(([set, count]) => {
      const bonuses = setBonuses[set as ItemSet];
      [2, 4, 6].forEach(n => {
        if ((count ?? 0) >= n && bonuses[n]) {
          const bonus = bonuses[n];
          this.stats.attack += bonus.attack;
          this.stats.defense += bonus.defense;
          this.stats.life += bonus.life;
        }
      });
    });
  }

  private generateItems(count: number): Item[] {
    const sets: ItemSet[] = ['Ninja', 'Warrior', 'Mage', 'Ranger', 'Soldier'];
    const slots: ItemSlot[] = ['weapon1', 'weapon2', 'chest', 'head', 'pants', 'feet', 'gloves', 'ring', 'necklace', 'cape'];

    const getRarity = (): ItemQuality => {
      const roll = Math.random();
      if (roll < 0.5) return 'Normal';
      if (roll < 0.8) return 'Unique';
      if (roll < 0.95) return 'Rare';
      return 'Legendary';
    };

    const multipliers: Record<ItemQuality, number> = {
      Normal: 1,
      Unique: 1.5,
      Rare: 2,
      Legendary: 3,
    };

    return Array.from({ length: count }, () => {
      const quality = getRarity();
      const set = Phaser.Utils.Array.GetRandom(sets);
      const slot = Phaser.Utils.Array.GetRandom(slots);
      const m = multipliers[quality];

      return {
        name: `${quality} ${set} ${slot}`,
        slot,
        set,
        quality,
        equipped: false,
        stats: {
          attack: Math.floor(Phaser.Math.Between(3, 10) * m),
          defense: Math.floor(Phaser.Math.Between(1, 5) * m),
          life: Math.floor(Phaser.Math.Between(5, 15) * m),
        },
      };
    });
  }

  private renderEnemy() {
    this.add.text(800, 200, `${this.currentEnemy.emoji} ${this.currentEnemy.name}`, {
      font: '24px Arial',
      color: '#ff8888'
    }).setOrigin(0.5);
  
    this.add.text(800, 240, `❤️ ${this.enemyLife}`, {
      font: '18px Arial',
      color: '#ffffff'
    }).setOrigin(0.5);
  }

  private renderAttackButton() {
    this.add.text(500, 650, '⚔️ Attack', {
      font: '20px Arial',
      backgroundColor: '#333',
      color: '#fff',
      padding: { x: 12, y: 6 }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.handleAttack());
  }
    
}
