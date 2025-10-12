import type { GameState } from '../types/game';
import './GameBoard.css';
import PlayerPanel from './PlayerPanel';
import PowerPlantMarket from './PowerPlantMarket';
import ResourceMarket from './ResourceMarket';
import GamePhaseDisplay from './GamePhaseDisplay';
import MapCanvas from './Map/MapCanvas';
import GameOverScreen from './GameOverScreen';
import { advancePhase, checkGameEnd } from '../game/phaseManager';

interface GameBoardProps {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
}

function GameBoard({ gameState, setGameState }: GameBoardProps) {
  const handleNextPhase = () => {
    // Check if game should end
    if (checkGameEnd(gameState)) {
      setGameState({
        ...gameState,
        phase: 'game-over',
      });
      return;
    }

    // Advance to next phase
    const newState = advancePhase(gameState);
    setGameState(newState);
  };

  const handleSaveGame = () => {
    // TODO: Implement save game functionality
    alert('Save game feature coming in Phase 3!');
  };

  const handleNewGame = () => {
    // Reload the page to start a new game
    window.location.reload();
  };

  return (
    <div className="game-board">
      {gameState.phase === 'game-over' && (
        <GameOverScreen gameState={gameState} onNewGame={handleNewGame} />
      )}
      <header className="game-header">
        <h1>Power Grid</h1>
        <div className="game-info">
          <span>Round: {gameState.round}</span>
          <span>Step: {gameState.step}</span>
        </div>
      </header>

      <GamePhaseDisplay phase={gameState.phase} />

      <div className="map-section">
        <MapCanvas gameState={gameState} />
      </div>

      <div className="game-content">
        <div className="left-panel">
          <PowerPlantMarket market={gameState.powerPlantMarket} />
          <ResourceMarket market={gameState.resourceMarket} />
        </div>

        <div className="right-panel">
          <div className="players-section">
            <h2>Players</h2>
            {gameState.players.map((player, index) => (
              <PlayerPanel
                key={player.id}
                player={player}
                isCurrentPlayer={index === gameState.currentPlayerIndex}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="game-controls">
        <button
          className="control-btn"
          onClick={handleNextPhase}
          disabled={gameState.phase === 'game-over'}
        >
          {gameState.phase === 'game-over' ? 'Game Over' : 'Next Phase'}
        </button>
        <button className="control-btn secondary" onClick={handleSaveGame}>
          Save Game
        </button>
      </div>
    </div>
  );
}

export default GameBoard;
