import type { GameState, PowerPlant, Player, AuctionState } from '../types/game';

/**
 * Initialize a new auction for a power plant
 * Only includes players who haven't bought this round
 */
export function startAuction(
  gameState: GameState,
  plant: PowerPlant,
  startingPlayerId: string
): AuctionState {
  // Only include players who haven't already bought this round
  const eligiblePlayers = gameState.players
    .map(p => p.id)
    .filter(id => !gameState.playersWhoHaveBoughtThisRound.includes(id));

  return {
    plant,
    currentBid: plant.number, // Minimum bid is the plant number
    currentBidder: null, // No bidder yet - first bidder can bid at minimum
    startingPlayer: startingPlayerId, // Track who started the auction
    activePlayers: eligiblePlayers, // Only players who haven't bought yet
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
  // If only one player left active, they win
  if (auction.activePlayers.length === 1) {
    return auction.activePlayers[0];
  }

  // If all players passed and we have a current bidder, they win
  if (auction.activePlayers.length === 0 && auction.currentBidder) {
    return auction.currentBidder;
  }

  // If nobody bid (everyone passed without bidding), the starting player must take it
  // This happens when the player who selected the plant is the last one standing
  if (auction.activePlayers.length === 0 && !auction.currentBidder) {
    return auction.startingPlayer;
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
 * Rotates through players in the GAME ORDER (not activePlayers order)
 * Skips players who have passed
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

  // Find current player's index in the GAME PLAYER ORDER (not active players)
  const allPlayerIds = allPlayers.map(p => p.id);
  const currentGameIndex = allPlayerIds.indexOf(currentPlayerId);

  if (currentGameIndex === -1) {
    // Current player not found, return first active player
    return activePlayerIds[0];
  }

  // Look for next active player in circular game order
  for (let i = 1; i <= allPlayers.length; i++) {
    const nextGameIndex = (currentGameIndex + i) % allPlayers.length;
    const nextPlayerId = allPlayerIds[nextGameIndex];

    // If this player is still active in the auction, return them
    if (activePlayerIds.includes(nextPlayerId)) {
      return nextPlayerId;
    }
  }

  // No active players found (shouldn't happen)
  return activePlayerIds[0];
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

/**
 * Get next player who hasn't bought a plant this round
 * Returns null if everyone has bought or passed
 */
export function getNextPlayerForAuction(gameState: GameState): string | null {
  // Find next player in order who hasn't bought this round
  for (let i = 0; i < gameState.players.length; i++) {
    const playerIndex = (gameState.currentPlayerIndex + i) % gameState.players.length;
    const player = gameState.players[playerIndex];

    // Skip if player already bought this round
    if (gameState.playersWhoHaveBoughtThisRound.includes(player.id)) {
      continue;
    }

    return player.id;
  }

  return null; // All players have bought
}

/**
 * Check if auction phase should end
 * Ends when all players have either bought a plant or everyone who needs one has one
 */
export function shouldAuctionPhaseEnd(gameState: GameState): boolean {
  const isFirstRoundGame = isFirstRound(gameState);

  if (isFirstRoundGame) {
    // First round: everyone must buy, so end when everyone has a plant
    return allPlayersHavePlants(gameState);
  }

  // Later rounds: end when everyone has had a chance
  // If no one left to auction, phase ends
  return getNextPlayerForAuction(gameState) === null;
}

/**
 * Mark player as having bought this round and get updated game state
 */
export function markPlayerAsBought(gameState: GameState, playerId: string): GameState {
  return {
    ...gameState,
    playersWhoHaveBoughtThisRound: [...gameState.playersWhoHaveBoughtThisRound, playerId],
  };
}
