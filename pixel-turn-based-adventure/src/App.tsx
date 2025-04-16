// src/App.tsx

import React from 'react';
import Game from './components/Game';

/**
 * Main application component that hosts the game.
 */
const App: React.FC = () => {
  return (
    <div className="App">
      <Game />
    </div>
  );
};

export default App;
