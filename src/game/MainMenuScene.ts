// src/game/MainMenuScene.ts
import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    const { width } = this.scale;

    this.cameras.main.setBackgroundColor('#1a1a1a');

    this.add.text(width / 2, 100, '🧙‍♂️ Pixel Turn-Based Adventure', {
      font: '28px Arial',
      color: '#ffffff',
    }).setOrigin(0.5);

    const menuItems = [
      { label: '👤 Select Character', scene: 'CharacterSelectScene' },
      { label: '▶️ New Game', scene: 'GameScene' },
      { label: '📂 Load Game', scene: null },
      { label: '⚙️ Options', scene: null },
    ];

    menuItems.forEach((item, index) => {
      const text = this.add.text(width / 2, 180 + index * 50, item.label, {
        font: '20px Arial',
        color: '#cccccc',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      text.on('pointerover', () => text.setColor('#ffffff'));
      text.on('pointerout', () => text.setColor('#cccccc'));

      text.on('pointerdown', () => {
        if (item.scene) {
          this.scene.start(item.scene);
        } else {
          alert(`${item.label} is coming soon!`);
        }
      });
    });
  }
}
