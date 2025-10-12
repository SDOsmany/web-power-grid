import type { GameState } from '../types/game';
import { determineWinner } from '../game/phaseManager';
import './GameOverScreen.css';

interface GameOverScreenProps {
  gameState: GameState;
  onNewGame: () => void;
}

function GameOverScreen({ gameState, onNewGame }: GameOverScreenProps) {
  const winnerId = determineWinner(gameState);
  const winner = gameState.players.find((p) => p.id === winnerId);

  // Sort players by final ranking
  const rankedPlayers = [...gameState.players].sort((a, b) => {
    // Primary: cities connected
    if (b.cities.length !== a.cities.length) {
      return b.cities.length - a.cities.length;
    }
    // Tiebreaker: money
    if (b.money !== a.money) {
      return b.money - a.money;
    }
    return 0;
  });

  return (
    <div className="game-over-overlay">
      <div className="game-over-container">
        <h1 className="game-over-title">Game Over!</h1>

        {winner && (
          <div className="winner-section">
            <div
              className="winner-badge"
              style={{ backgroundColor: winner.color }}
            >
              🏆
            </div>
            <h2 className="winner-name">{winner.name} Wins!</h2>
            <div className="winner-stats">
              <div className="stat">
                <span className="stat-label">Cities Connected:</span>
                <span className="stat-value">{winner.cities.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Final Money:</span>
                <span className="stat-value">${winner.money}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Power Plants:</span>
                <span className="stat-value">{winner.powerPlants.length}</span>
              </div>
            </div>
          </div>
        )}

        <div className="final-rankings">
          <h3>Final Rankings</h3>
          <div className="rankings-list">
            {rankedPlayers.map((player, index) => (
              <div key={player.id} className="ranking-row">
                <span className="rank">#{index + 1}</span>
                <div
                  className="player-color-dot"
                  style={{ backgroundColor: player.color }}
                />
                <span className="player-name">{player.name}</span>
                <span className="player-cities">{player.cities.length} cities</span>
                <span className="player-money">${player.money}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="game-over-actions">
          <button className="new-game-btn" onClick={onNewGame}>
            New Game
          </button>
        </div>

        <div className="game-summary">
          <p>Rounds Played: {gameState.round}</p>
          <p>Final Step: {gameState.step}</p>
        </div>
      </div>
    </div>
  );
}

export default GameOverScreen;
