import type { GameState, PowerPlant, Player, AuctionState } from '../types/game';

/**
 * Initialize a new auction for a power plant
 */
export function startAuction(
  gameState: GameState,
  plant: PowerPlant,
  startingPlayerId: string
): AuctionState {
  return {
    plant,
    currentBid: plant.number, // Minimum bid is the plant number
    currentBidder: null,
    activePlayers: gameState.players.map(p => p.id),
    passedPlayers: [],
  };
}

/**
 * Place a bid in the auction
 */
export function placeBid(
  auction: AuctionState,
  playerId: string,
  bidAmount: number
): AuctionState {
  return {
    ...auction,
    currentBid: bidAmount,
    currentBidder: playerId,
  };
}

/**
 * Player passes on the auction
 */
export function passAuction(auction: AuctionState, playerId: string): AuctionState {
  return {
    ...auction,
    activePlayers: auction.activePlayers.filter(id => id !== playerId),
    passedPlayers: [...auction.passedPlayers, playerId],
  };
}

/**
 * Check if auction is complete (only one active player left)
 */
export function isAuctionComplete(auction: AuctionState): boolean {
  return auction.activePlayers.length <= 1;
}

/**
 * Get the winner of the auction
 */
export function getAuctionWinner(auction: AuctionState): string | null {
  if (auction.activePlayers.length === 1) {
    return auction.activePlayers[0];
  }
  return auction.currentBidder;
}

/**
 * Award plant to winner and deduct money
 */
export function awardPlant(
  gameState: GameState,
  winnerId: string,
  plant: PowerPlant,
  finalBid: number
): GameState {
  const updatedPlayers = gameState.players.map(player => {
    if (player.id === winnerId) {
      // Check if player has 3 plants already
      if (player.powerPlants.length >= 3) {
        // Player needs to discard one (we'll handle this in UI)
        // For now, just add it and we'll handle discard separately
        return {
          ...player,
          powerPlants: [...player.powerPlants, plant],
          money: player.money - finalBid,
        };
      }

      return {
        ...player,
        powerPlants: [...player.powerPlants, plant],
        money: player.money - finalBid,
      };
    }
    return player;
  });

  return {
    ...gameState,
    players: updatedPlayers,
  };
}

/**
 * Remove a plant from current market and refresh
 */
export function refreshPowerPlantMarket(
  gameState: GameState,
  purchasedPlant: PowerPlant
): GameState {
  // Remove the purchased plant from current market
  const currentWithoutPurchased = gameState.powerPlantMarket.current.filter(
    p => p.number !== purchasedPlant.number
  );

  // If we have cards in the deck, draw one
  let newDeck = [...gameState.powerPlantMarket.deck];
  let allPlants = [
    ...currentWithoutPurchased,
    ...gameState.powerPlantMarket.future,
  ];

  if (newDeck.length > 0) {
    const drawnPlant = newDeck[0];
    newDeck = newDeck.slice(1);
    allPlants.push(drawnPlant);
  }

  // Sort all plants by number
  allPlants.sort((a, b) => a.number - b.number);

  // Split into current (4 lowest) and future (4 next)
  const newCurrent = allPlants.slice(0, 4);
  const newFuture = allPlants.slice(4, 8);

  return {
    ...gameState,
    powerPlantMarket: {
      current: newCurrent,
      future: newFuture,
      deck: newDeck,
    },
  };
}

/**
 * Check if a player can afford a bid
 */
export function canAffordBid(player: Player, bidAmount: number): boolean {
  return player.money >= bidAmount;
}

/**
 * Get the next player in auction order
 */
export function getNextAuctionPlayer(
  auction: AuctionState,
  currentPlayerId: string,
  allPlayers: Player[]
): string | null {
  const activePlayerIds = auction.activePlayers;

  if (activePlayerIds.length === 0) {
    return null;
  }

  // Find current player index in active players
  const currentIndex = activePlayerIds.indexOf(currentPlayerId);

  if (currentIndex === -1) {
    // Current player not active, return first active player
    return activePlayerIds[0];
  }

  // Return next active player (wrap around)
  const nextIndex = (currentIndex + 1) % activePlayerIds.length;
  return activePlayerIds[nextIndex];
}

/**
 * Check if it's the first round (everyone must buy a plant)
 */
export function isFirstRound(gameState: GameState): boolean {
  return gameState.round === 1;
}

/**
 * Check if all players have at least one plant
 */
export function allPlayersHavePlants(gameState: GameState): boolean {
  return gameState.players.every(player => player.powerPlants.length > 0);
}
