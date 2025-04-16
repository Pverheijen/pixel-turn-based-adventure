// src/game/VictoryScene.ts
import Phaser from 'phaser';

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#000');
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

    this.add.text(width / 2, 150, '🏆 Victory!', {
      font: '48px Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(width / 2, 240, 'You completed all 10 stages.', {
      font: '24px Arial',
      color: '#dddddd'
    }).setOrigin(0.5);

    this.add.text(width / 2, 300, 'The realm is safe thanks to your courage.', {
      font: '20px Arial',
      color: '#bbbbbb'
    }).setOrigin(0.5);

    const backButton = this.add.text(width / 2, 400, '🔁 Back to Main Menu', {
      font: '22px Arial',
      color: '#ffffff',
      backgroundColor: '#444',
      padding: { x: 12, y: 8 }
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('MainMenuScene');
      });
  }
}
