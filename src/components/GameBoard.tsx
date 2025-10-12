import type { GameState } from '../types/game';
import './GameBoard.css';
import PlayerPanel from './PlayerPanel';
import PowerPlantMarket from './PowerPlantMarket';
import ResourceMarket from './ResourceMarket';
import GamePhaseDisplay from './GamePhaseDisplay';

interface GameBoardProps {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
}

function GameBoard({ gameState, setGameState }: GameBoardProps) {
  return (
    <div className="game-board">
      <header className="game-header">
        <h1>Power Grid</h1>
        <div className="game-info">
          <span>Round: {gameState.round}</span>
          <span>Step: {gameState.step}</span>
        </div>
      </header>

      <GamePhaseDisplay phase={gameState.phase} />

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
        <button className="control-btn">Next Phase</button>
        <button className="control-btn secondary">Save Game</button>
      </div>
    </div>
  );
}

export default GameBoard;
