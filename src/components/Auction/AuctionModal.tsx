import { useState, useEffect } from 'react';
import type { GameState, PowerPlant, AuctionState } from '../../types/game';
import {
  startAuction,
  placeBid,
  passAuction,
  isAuctionComplete,
  getAuctionWinner,
  awardPlant,
  refreshPowerPlantMarket,
  canAffordBid,
  getNextAuctionPlayer,
  isFirstRound,
} from '../../game/auctionManager';
import './AuctionModal.css';

interface AuctionModalProps {
  gameState: GameState;
  onAuctionComplete: (newGameState: GameState) => void;
  onClose: () => void;
}

function AuctionModal({ gameState, onAuctionComplete, onClose }: AuctionModalProps) {
  const [auction, setAuction] = useState<AuctionState | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<PowerPlant | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState<string>(
    gameState.players[gameState.currentPlayerIndex]?.id || ''
  );

  const currentPlayer = gameState.players.find(p => p.id === currentTurnPlayerId);
  const isFirstRoundGame = isFirstRound(gameState);

  // Plant selection phase (before auction starts)
  const handleSelectPlant = (plant: PowerPlant) => {
    const newAuction = startAuction(gameState, plant, currentTurnPlayerId);
    setAuction(newAuction);
    setSelectedPlant(plant);
    setBidAmount(plant.number); // Minimum bid
  };

  // Place a bid
  const handleBid = () => {
    if (!auction || !currentPlayer) return;

    // First bid can be at minimum, subsequent bids must be higher
    const minimumBid = auction.currentBidder === null
      ? auction.currentBid  // First bid can match minimum (plant number)
      : auction.currentBid + 1;  // Subsequent bids must be higher

    if (bidAmount < minimumBid) {
      alert('Bid must be at least ' + minimumBid);
      return;
    }

    if (!canAffordBid(currentPlayer, bidAmount)) {
      alert("You don't have enough money!");
      return;
    }

    const newAuction = placeBid(auction, currentTurnPlayerId, bidAmount);
    setAuction(newAuction);

    // Move to next player
    const nextPlayerId = getNextAuctionPlayer(newAuction, currentTurnPlayerId, gameState.players);
    if (nextPlayerId) {
      setCurrentTurnPlayerId(nextPlayerId);
    }

    // Check if auction is complete
    if (isAuctionComplete(newAuction)) {
      completeAuction(newAuction);
    }
  };

  // Pass on the auction
  const handlePass = () => {
    if (!auction) return;

    // In first round, cannot pass if you don't have a plant
    if (isFirstRoundGame && currentPlayer && currentPlayer.powerPlants.length === 0) {
      alert('You must buy a plant in the first round!');
      return;
    }

    const newAuction = passAuction(auction, currentTurnPlayerId);
    setAuction(newAuction);

    // Check if auction is complete
    if (isAuctionComplete(newAuction)) {
      completeAuction(newAuction);
    } else {
      // Move to next player
      const nextPlayerId = getNextAuctionPlayer(newAuction, currentTurnPlayerId, gameState.players);
      if (nextPlayerId) {
        setCurrentTurnPlayerId(nextPlayerId);
      }
    }
  };

  // Complete the auction
  const completeAuction = (finalAuction: AuctionState) => {
    const winnerId = getAuctionWinner(finalAuction);

    if (!winnerId || !selectedPlant) {
      alert('No winner for this auction');
      return;
    }

    // Award plant to winner
    let newGameState = awardPlant(
      gameState,
      winnerId,
      selectedPlant,
      finalAuction.currentBid
    );

    // Refresh market
    newGameState = refreshPowerPlantMarket(newGameState, selectedPlant);

    // Complete auction
    onAuctionComplete(newGameState);
  };

  // Cancel auction and go back to plant selection
  const handleCancelAuction = () => {
    setAuction(null);
    setSelectedPlant(null);
    setBidAmount(0);
  };

  // Player can pass if they already have a plant OR it's not first round
  const canPass = () => {
    if (!currentPlayer) return false;
    if (!isFirstRoundGame) return true;
    return currentPlayer.powerPlants.length > 0;
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'coal': return '⚫';
      case 'oil': return '🛢️';
      case 'garbage': return '🗑️';
      case 'uranium': return '☢️';
      case 'hybrid': return '⚡';
      case 'eco': return '🌱';
      default: return '❓';
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'coal': return '#2c3e50';
      case 'oil': return '#34495e';
      case 'garbage': return '#7f8c8d';
      case 'uranium': return '#27ae60';
      case 'hybrid': return '#e67e22';
      case 'eco': return '#16a085';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="auction-modal-overlay">
      <div className="auction-modal">
        <div className="auction-header">
          <h2>Power Plant Auction</h2>
          {isFirstRoundGame && (
            <div className="first-round-notice">
              First Round: Everyone must buy a plant!
            </div>
          )}
        </div>

        {/* Selection Phase */}
        {!auction && (
          <div className="plant-selection">
            <h3>
              {currentPlayer?.name}, select a plant to auction:
            </h3>
            <div className="plants-grid">
              {gameState.powerPlantMarket.current.map(plant => (
                <div
                  key={plant.number}
                  className="auction-plant-card"
                  onClick={() => handleSelectPlant(plant)}
                >
                  <div
                    className="plant-number"
                    style={{ backgroundColor: getResourceColor(plant.resourceType) }}
                  >
                    {plant.number}
                  </div>
                  <div className="plant-details">
                    <div className="plant-resource">
                      <span className="resource-icon">{getResourceIcon(plant.resourceType)}</span>
                      <span>{plant.resourceType}</span>
                    </div>
                    <div className="plant-stats">
                      <span>Cost: {plant.resourceCost}</span>
                      <span>Powers: {plant.citiesPowered} 🏙️</span>
                    </div>
                  </div>
                  <div className="min-bid">Min Bid: ${plant.number}</div>
                </div>
              ))}
            </div>
            {canPass() && (
              <button className="pass-btn-large" onClick={onClose}>
                Pass (Don't buy this turn)
              </button>
            )}
          </div>
        )}

        {/* Bidding Phase */}
        {auction && selectedPlant && (
          <div className="bidding-phase">
            <div className="auction-plant-display">
              <div
                className="plant-number-large"
                style={{ backgroundColor: getResourceColor(selectedPlant.resourceType) }}
              >
                {selectedPlant.number}
              </div>
              <div className="plant-info-large">
                <div className="plant-resource-large">
                  <span className="resource-icon-large">
                    {getResourceIcon(selectedPlant.resourceType)}
                  </span>
                  <span className="resource-type">{selectedPlant.resourceType}</span>
                </div>
                <div className="plant-stats-large">
                  <div>Resource Cost: {selectedPlant.resourceCost}</div>
                  <div>Cities Powered: {selectedPlant.citiesPowered}</div>
                </div>
              </div>
            </div>

            <div className="current-bid-display">
              <div className="current-bid-label">Current Bid</div>
              <div className="current-bid-amount">${auction.currentBid}</div>
              {auction.currentBidder && (
                <div className="current-bidder">
                  by {gameState.players.find(p => p.id === auction.currentBidder)?.name}
                </div>
              )}
            </div>

            <div className="current-turn">
              <div className="turn-indicator">
                Current Turn: <strong>{currentPlayer?.name}</strong>
              </div>
              <div className="player-money">Money: ${currentPlayer?.money}</div>
            </div>

            <div className="bidding-controls">
              <div className="bid-input-section">
                <label>Your Bid:</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(parseInt(e.target.value) || 0)}
                  min={auction.currentBidder === null ? auction.currentBid : auction.currentBid + 1}
                  className="bid-input"
                />
                <button
                  className="bid-btn"
                  onClick={handleBid}
                  disabled={
                    auction.currentBidder === null
                      ? bidAmount < auction.currentBid
                      : bidAmount < auction.currentBid + 1
                  }
                >
                  Place Bid
                </button>
              </div>

              <div className="action-buttons">
                <button
                  className="pass-btn"
                  onClick={handlePass}
                  disabled={!canPass()}
                >
                  Pass
                </button>
                <button
                  className="cancel-btn"
                  onClick={handleCancelAuction}
                >
                  Choose Different Plant
                </button>
              </div>
            </div>

            <div className="active-players">
              <h4>Active Bidders:</h4>
              <div className="players-list">
                {auction.activePlayers.map(playerId => {
                  const player = gameState.players.find(p => p.id === playerId);
                  return (
                    <div
                      key={playerId}
                      className={`player-chip ${playerId === currentTurnPlayerId ? 'current' : ''}`}
                    >
                      <div
                        className="player-color-dot"
                        style={{ backgroundColor: player?.color }}
                      />
                      {player?.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuctionModal;
