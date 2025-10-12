import { useState } from 'react';
import './App.css';
import { GameState, Player } from './types/game';
import { initializeGame } from './game/gameLogic';
import GameBoard from './components/GameBoard';
import SetupScreen from './components/SetupScreen';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleStartGame = (playerNames: string[]) => {
    const newGame = initializeGame(playerNames);
    setGameState(newGame);
  };

  return (
    <div className="app">
      {!gameState ? (
        <SetupScreen onStartGame={handleStartGame} />
      ) : (
        <GameBoard gameState={gameState} setGameState={setGameState} />
      )}
    </div>
  );
}

export default App;
