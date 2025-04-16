// MainScene.js
export default class MainScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MainScene' });
    }
  
    preload() {
      // Load sprites and assets
      this.load.image('hero', 'src/assets/characters/hero.png');
      this.load.image('enemy', 'src/assets/enemies/enemy1.png');
      this.load.image('button', 'src/assets/ui/button.png');    
    }
  
    create() {
      // Add hero sprite
      // this.hero = this.add.sprite(100, 300, 'hero').setScale(3);
      this.add.image(100, 300, 'hero').setScale(2);
      this.add.image(700, 300, 'enemy').setScale(2);

      
      // Display basic text
      this.add.text(300, 50, 'Stage 1: Begin your adventure!', {
        font: '16px monospace',
        fill: '#ffffff',
      });
    }
  }
  