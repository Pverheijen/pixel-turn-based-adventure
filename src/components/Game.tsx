// src/components/Game.tsx
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { GameScene } from '../game/GameScene';
import { MainMenuScene } from '../game/MainMenuScene';
import { CharacterSelectScene } from '../game/CharacterSelectScene';

const Game: React.FC = () => {
  const gameContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameContainer.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1000,
      height: 700,
      parent: gameContainer.current,
      scene: [CharacterSelectScene, MainMenuScene, GameScene],
      pixelArt: true,
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameContainer} />;
};

export default Game;
