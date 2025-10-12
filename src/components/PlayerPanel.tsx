import type { Player } from '../types/game';
import './PlayerPanel.css';

interface PlayerPanelProps {
  player: Player;
  isCurrentPlayer: boolean;
}

function PlayerPanel({ player, isCurrentPlayer }: PlayerPanelProps) {
  return (
    <div className={`player-panel ${isCurrentPlayer ? 'current' : ''}`}>
      <div className="player-header">
        <div className="player-color" style={{ backgroundColor: player.color }}></div>
        <div className="player-name">{player.name}</div>
        {isCurrentPlayer && <span className="current-badge">Current</span>}
      </div>

      <div className="player-stats">
        <div className="stat">
          <span className="stat-label">Money:</span>
          <span className="stat-value">${player.money}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Cities:</span>
          <span className="stat-value">{player.cities.length}</span>
        </div>
      </div>

      {player.powerPlants.length > 0 && (
        <div className="player-plants">
          <div className="section-title">Power Plants:</div>
          <div className="plants-list">
            {player.powerPlants.map((plant) => (
              <div key={plant.number} className="mini-plant">
                <span className="plant-number">#{plant.number}</span>
                <span className="plant-cities">{plant.citiesPowered}🏙️</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="player-resources">
        <div className="section-title">Resources:</div>
        <div className="resources-grid">
          <div className="resource-item">
            <span className="resource-icon coal">⚫</span>
            <span>{player.resources.coal}</span>
          </div>
          <div className="resource-item">
            <span className="resource-icon oil">⚫</span>
            <span>{player.resources.oil}</span>
          </div>
          <div className="resource-item">
            <span className="resource-icon garbage">⚫</span>
            <span>{player.resources.garbage}</span>
          </div>
          <div className="resource-item">
            <span className="resource-icon uranium">⚫</span>
            <span>{player.resources.uranium}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerPanel;
