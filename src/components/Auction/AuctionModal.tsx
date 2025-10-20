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
  markPlayerAsBought,
  getNextPlayerForAuction,
  shouldAuctionPhaseEnd,
} from '../../game/auctionManager';
import './AuctionModal.css';

interface AuctionModalProps {
  gameState: GameState;
  onAuctionComplete: (newGameState: GameState) => void;
  onClose: () => void;
}

function AuctionModal({ gameState: initialGameState, onAuctionComplete, onClose }: AuctionModalProps) {
  // Internal game state that updates during the auction round
  const [internalGameState, setInternalGameState] = useState<GameState>(initialGameState);
  const [auction, setAuction] = useState<AuctionState | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<PowerPlant | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState<string>(
    initialGameState.players[initialGameState.currentPlayerIndex]?.id || ''
  );

  const currentPlayer = internalGameState.players.find(p => p.id === currentTurnPlayerId);
  const isFirstRoundGame = isFirstRound(internalGameState);

  // Plant selection phase (before auction starts)
  const handleSelectPlant = (plant: PowerPlant) => {
    const newAuction = startAuction(internalGameState, plant, currentTurnPlayerId);
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
    const nextPlayerId = getNextAuctionPlayer(newAuction, currentTurnPlayerId, internalGameState.players);
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

    // Use the validation function
    if (!canPassDuringAuction()) {
      alert('You cannot pass - you must bid on the plant you selected!');
      return;
    }

    const newAuction = passAuction(auction, currentTurnPlayerId);
    setAuction(newAuction);

    // Check if auction is complete
    if (isAuctionComplete(newAuction)) {
      completeAuction(newAuction);
    } else {
      // Move to next player
      const nextPlayerId = getNextAuctionPlayer(newAuction, currentTurnPlayerId, internalGameState.players);
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
      internalGameState,
      winnerId,
      selectedPlant,
      finalAuction.currentBid
    );

    // Refresh market
    newGameState = refreshPowerPlantMarket(newGameState, selectedPlant);

    // Mark winner as having bought this round
    newGameState = markPlayerAsBought(newGameState, winnerId);

    // Check if auction phase should end
    if (shouldAuctionPhaseEnd(newGameState)) {
      // Auction phase is complete, notify parent and close modal
      onAuctionComplete(newGameState);
      return;
    }

    // Get next player who hasn't bought
    const nextPlayerId = getNextPlayerForAuction(newGameState);

    if (nextPlayerId) {
      // Move to next player and update INTERNAL state (keep modal open)
      const nextPlayerIndex = newGameState.players.findIndex(p => p.id === nextPlayerId);
      newGameState = {
        ...newGameState,
        currentPlayerIndex: nextPlayerIndex,
      };

      // Update internal state to show next player's turn
      setInternalGameState(newGameState);
      setCurrentTurnPlayerId(nextPlayerId);
      setAuction(null);
      setSelectedPlant(null);
      // Modal stays open for next player!
    } else {
      // No one left to auction, phase is complete
      onAuctionComplete(newGameState);
    }
  };

  // Cancel auction and go back to plant selection
  const handleCancelAuction = () => {
    setAuction(null);
    setSelectedPlant(null);
    setBidAmount(0);
  };

  // Player can pass during auction bidding
  const canPassDuringAuction = () => {
    if (!currentPlayer || !auction) return false;

    // In first round, special rules apply
    if (isFirstRoundGame) {
      // If you're the one who started the auction and have no plants...
      if (currentTurnPlayerId === auction.startingPlayer && currentPlayer.powerPlants.length === 0) {
        // ...you can only pass if someone else has already bid
        // (If nobody bid yet, you must make first bid)
        if (auction.currentBidder === null) {
          return false; // Must make first bid
        }
        return true; // Someone else bid, you can pass now
      }
      // Everyone else can always pass (even without plants)
      return true;
    }

    // Not first round - everyone can always pass
    return true;
  };

  // Player can pass at plant selection phase (before selecting a plant)
  const canPassSelection = () => {
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
              {internalGameState.powerPlantMarket.current.map(plant => (
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
            {canPassSelection() && (
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
                  by {internalGameState.players.find(p => p.id === auction.currentBidder)?.name}
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
                  disabled={!canPassDuringAuction()}
                >
                  Pass
                </button>
                {/* Only show cancel button for the player who started the auction */}
                {currentTurnPlayerId === auction.startingPlayer && auction.currentBidder === null && (
                  <button
                    className="cancel-btn"
                    onClick={handleCancelAuction}
                  >
                    Choose Different Plant
                  </button>
                )}
              </div>
            </div>

            <div className="active-players">
              <h4>Active Bidders:</h4>
              <div className="players-list">
                {auction.activePlayers.map(playerId => {
                  const player = internalGameState.players.find(p => p.id === playerId);
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
