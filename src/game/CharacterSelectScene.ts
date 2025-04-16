// src/game/CharacterSelectScene.ts
import Phaser from 'phaser';

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterSelectScene' });
  }

  create() {
    const { width } = this.scale;

    this.cameras.main.setBackgroundColor('#000');

    this.add.text(width / 2, 80, '🧝 Choose Your Class', {
      font: '28px Arial',
      color: '#ffffff',
    }).setOrigin(0.5);

    const characters = [
      { label: '🛡 Knight', key: 'Knight' },
      { label: '🧙 Mage', key: 'Mage' },
      { label: '🗡 Rogue', key: 'Rogue' },
    ];

    characters.forEach((char, index) => {
      const text = this.add.text(width / 2, 150 + index * 60, char.label, {
        font: '22px Arial',
        color: '#cccccc',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      text.on('pointerover', () => text.setColor('#ffffff'));
      text.on('pointerout', () => text.setColor('#cccccc'));

      text.on('pointerdown', () => {
        localStorage.setItem('selectedCharacter', char.key);
        this.scene.start('MainMenuScene');
      });
    });
  }
}
