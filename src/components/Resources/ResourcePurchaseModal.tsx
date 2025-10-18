import type { GameState } from '../../types/game';
import {
  getResourcePurchaseOptions,
  purchaseResource,
  type ResourcePurchaseOption,
} from '../../game/resourceManager';
import './ResourcePurchaseModal.css';

interface ResourcePurchaseModalProps {
  gameState: GameState;
  onPurchase: (newState: GameState) => void;
  onPass: () => void;
  onClose: () => void;
}

function ResourcePurchaseModal({
  gameState,
  onPurchase,
  onPass,
  onClose,
}: ResourcePurchaseModalProps) {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const options = getResourcePurchaseOptions(gameState, currentPlayer.id);

  const handlePurchase = (resourceType: ResourcePurchaseOption['type']) => {
    const newState = purchaseResource(gameState, currentPlayer.id, resourceType);
    if (newState) {
      onPurchase(newState);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'coal':
        return '🪨';
      case 'oil':
        return '🛢️';
      case 'garbage':
        return '🗑️';
      case 'uranium':
        return '☢️';
      default:
        return '❓';
    }
  };

  const canPurchaseAny = options.some((opt) => opt.canPurchase);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content resource-purchase-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Buy Resources</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="player-info">
            <h3 style={{ color: currentPlayer.color }}>{currentPlayer.name}</h3>
            <p className="player-money">Money: {currentPlayer.money} Elektro</p>
          </div>

          <div className="resource-options">
            {options.map((option) => (
              <div
                key={option.type}
                className={`resource-option ${!option.canPurchase ? 'disabled' : ''}`}
              >
                <div className="resource-header">
                  <span className="resource-icon">{getResourceIcon(option.type)}</span>
                  <span className="resource-name">{option.type.toUpperCase()}</span>
                </div>

                <div className="resource-details">
                  <p>Available: {option.available}</p>
                  <p>Cost: {option.cost !== null ? `${option.cost} Elektro` : 'N/A'}</p>
                </div>

                {!option.canPurchase && (
                  <div className="purchase-status">
                    {option.cost === null && <span className="status-text">None available</span>}
                    {option.cost !== null && !option.canAfford && (
                      <span className="status-text">Cannot afford</span>
                    )}
                    {option.cost !== null && !option.hasStorage && (
                      <span className="status-text">No storage space</span>
                    )}
                  </div>
                )}

                <button
                  className="purchase-button"
                  disabled={!option.canPurchase}
                  onClick={() => handlePurchase(option.type)}
                >
                  {option.canPurchase ? `Buy for ${option.cost}` : 'Cannot Buy'}
                </button>
              </div>
            ))}
          </div>

          <div className="current-resources">
            <h4>Current Resources:</h4>
            <div className="resource-summary">
              <span>🪨 Coal: {currentPlayer.resources.coal || 0}</span>
              <span>🛢️ Oil: {currentPlayer.resources.oil || 0}</span>
              <span>🗑️ Garbage: {currentPlayer.resources.garbage || 0}</span>
              <span>☢️ Uranium: {currentPlayer.resources.uranium || 0}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="pass-button" onClick={onPass}>
            {canPurchaseAny ? 'Done Purchasing' : 'Pass'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResourcePurchaseModal;
