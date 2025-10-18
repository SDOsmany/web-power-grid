import { useState } from 'react';
import type { GameState } from '../types/game';
import './GameBoard.css';
import PlayerPanel from './PlayerPanel';
import PowerPlantMarket from './PowerPlantMarket';
import ResourceMarket from './ResourceMarket';
import GamePhaseDisplay from './GamePhaseDisplay';
import MapCanvas from './Map/MapCanvas';
import GameOverScreen from './GameOverScreen';
import AuctionModal from './Auction/AuctionModal';
import ResourcePurchaseModal from './Resources/ResourcePurchaseModal';
import { advancePhase, checkGameEnd } from '../game/phaseManager';

interface GameBoardProps {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
}

function GameBoard({ gameState, setGameState }: GameBoardProps) {
  const [showAuction, setShowAuction] = useState(false);
  const [showResourcePurchase, setShowResourcePurchase] = useState(false);

  const handleNextPhase = () => {
    // If entering auction phase, show auction modal instead of advancing
    if (gameState.phase === 'determine-player-order' || gameState.phase === 'setup') {
      const newState = advancePhase(gameState);
      setGameState(newState);
      if (newState.phase === 'auction-power-plants') {
        setShowAuction(true);
        return;
      }
    }

    // If entering buy-resources phase, show resource purchase modal
    if (gameState.phase === 'auction-power-plants') {
      const newState = advancePhase(gameState);
      setGameState(newState);
      if (newState.phase === 'buy-resources') {
        setShowResourcePurchase(true);
        return;
      }
    }

    // Check if game should end AFTER build-network phase (official rules)
    if (gameState.phase === 'build-network' && checkGameEnd(gameState)) {
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

  const handleAuctionComplete = (newGameState: GameState) => {
    setGameState(newGameState);
    setShowAuction(false);
  };

  const handleAuctionClose = () => {
    setShowAuction(false);
    // Advance to next phase when auction closes
    const newState = advancePhase(gameState);
    setGameState(newState);
    if (newState.phase === 'buy-resources') {
      setShowResourcePurchase(true);
    }
  };

  const handleResourcePurchase = (newGameState: GameState) => {
    setGameState(newGameState);
  };

  const handleResourcePurchasePass = () => {
    // Move to next player or advance phase if all players are done
    const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;

    if (nextPlayerIndex === 0) {
      // All players have had their turn, close modal and advance phase
      setShowResourcePurchase(false);
      const newState = advancePhase(gameState);
      setGameState(newState);
    } else {
      // Move to next player
      setGameState({
        ...gameState,
        currentPlayerIndex: nextPlayerIndex,
      });
    }
  };

  const handleResourcePurchaseClose = () => {
    setShowResourcePurchase(false);
    const newState = advancePhase(gameState);
    setGameState(newState);
  };

  return (
    <div className="game-board">
      {gameState.phase === 'game-over' && (
        <GameOverScreen gameState={gameState} onNewGame={handleNewGame} />
      )}
      {showAuction && gameState.phase === 'auction-power-plants' && (
        <AuctionModal
          gameState={gameState}
          onAuctionComplete={handleAuctionComplete}
          onClose={handleAuctionClose}
        />
      )}
      {showResourcePurchase && gameState.phase === 'buy-resources' && (
        <ResourcePurchaseModal
          gameState={gameState}
          onPurchase={handleResourcePurchase}
          onPass={handleResourcePurchasePass}
          onClose={handleResourcePurchaseClose}
        />
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
