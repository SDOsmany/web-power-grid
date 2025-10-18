import type { GameState, GamePhase, Player } from '../types/game';
import { PLAYER_CONFIG, refillResourceMarket } from './gameLogic';

// Define the order of phases in a round
const PHASE_ORDER: GamePhase[] = [
  'determine-player-order',
  'auction-power-plants',
  'buy-resources',
  'build-network',
  'bureaucracy',
];

/**
 * Get the next phase in the game sequence
 */
export function getNextPhase(currentPhase: GamePhase): GamePhase {
  // Special case: setup goes to determine-player-order
  if (currentPhase === 'setup') {
    return 'determine-player-order';
  }

  // Special case: game-over stays at game-over
  if (currentPhase === 'game-over') {
    return 'game-over';
  }

  const currentIndex = PHASE_ORDER.indexOf(currentPhase);

  // If we're at the last phase, go back to the first (new round)
  if (currentIndex === PHASE_ORDER.length - 1) {
    return PHASE_ORDER[0]; // Start new round
  }

  return PHASE_ORDER[currentIndex + 1];
}

/**
 * Advance to the next phase
 * Returns updated game state
 */
export function advancePhase(gameState: GameState): GameState {
  const currentPhase = gameState.phase;
  const nextPhase = getNextPhase(currentPhase);

  // Check if we're starting a new round
  const isNewRound = currentPhase === 'bureaucracy' && nextPhase === 'determine-player-order';

  const newState: GameState = {
    ...gameState,
    phase: nextPhase,
    round: isNewRound ? gameState.round + 1 : gameState.round,
  };

  // Execute phase-specific logic
  switch (nextPhase) {
    case 'determine-player-order':
      return handleDeterminePlayerOrder(newState);
    case 'auction-power-plants':
      return handleAuctionStart(newState);
    case 'buy-resources':
      return handleBuyResourcesStart(newState);
    case 'build-network':
      return handleBuildNetworkStart(newState);
    case 'bureaucracy':
      return handleBureaucracyStart(newState);
    default:
      return newState;
  }
}

/**
 * Phase 1: Determine Player Order
 * Sort players by cities connected, then by highest plant
 */
function handleDeterminePlayerOrder(gameState: GameState): GameState {
  // First round: keep initial order (random/setup order)
  if (gameState.round === 1) {
    return {
      ...gameState,
      currentPlayerIndex: 0,
    };
  }

  // Sort players by game rules
  const sortedPlayers = [...gameState.players].sort((a, b) => {
    // Primary: number of cities (descending)
    if (b.cities.length !== a.cities.length) {
      return b.cities.length - a.cities.length;
    }

    // Tiebreaker: highest plant number (descending)
    const aHighest = a.powerPlants.length > 0
      ? Math.max(...a.powerPlants.map(p => p.number))
      : 0;
    const bHighest = b.powerPlants.length > 0
      ? Math.max(...b.powerPlants.map(p => p.number))
      : 0;

    return bHighest - aHighest;
  });

  return {
    ...gameState,
    players: sortedPlayers,
    currentPlayerIndex: 0,
  };
}

/**
 * Phase 2: Auction Power Plants
 */
function handleAuctionStart(gameState: GameState): GameState {
  // Reset to first player (already sorted from Phase 1)
  // Clear the list of players who bought this round
  return {
    ...gameState,
    currentPlayerIndex: 0,
    playersWhoHaveBoughtThisRound: [], // Reset for new auction round
  };
}

/**
 * Phase 3: Buy Resources
 * Players go in REVERSE order (last place first)
 */
function handleBuyResourcesStart(gameState: GameState): GameState {
  return {
    ...gameState,
    currentPlayerIndex: gameState.players.length - 1, // Start with last player
  };
}

/**
 * Phase 4: Build Network
 * Players go in REVERSE order (last place first)
 */
function handleBuildNetworkStart(gameState: GameState): GameState {
  return {
    ...gameState,
    currentPlayerIndex: gameState.players.length - 1, // Start with last player
  };
}

/**
 * Phase 5: Bureaucracy
 * All players act simultaneously (but we'll process in order)
 * This is when we:
 * 1. Collect income from powered cities
 * 2. Check for Step 2 trigger
 * 3. Refill resources
 */
function handleBureaucracyStart(gameState: GameState): GameState {
  const config = PLAYER_CONFIG[gameState.players.length] || PLAYER_CONFIG[4];
  let newState = { ...gameState, currentPlayerIndex: 0 };

  // Check if Step 2 should be triggered
  const shouldTriggerStep2 = newState.step === 1 && newState.players.some(
    (player) => player.cities.length >= config.step2Trigger
  );

  if (shouldTriggerStep2) {
    newState = {
      ...newState,
      step: 2,
    };
    // TODO: Remove lowest plant from market and draw replacement
  }

  // Refill resources at end of bureaucracy
  newState = refillResourceMarket(newState);

  return newState;
}

/**
 * Move to next player in current phase
 */
export function advanceToNextPlayer(gameState: GameState): GameState {
  const { currentPlayerIndex, players, phase } = gameState;

  // Determine direction based on phase
  const isReverseOrder = phase === 'buy-resources' || phase === 'build-network';

  let nextIndex: number;

  if (isReverseOrder) {
    // Go backwards (last to first)
    nextIndex = currentPlayerIndex - 1;
    if (nextIndex < 0) {
      nextIndex = 0; // Stay at first player (done with phase)
    }
  } else {
    // Go forwards (first to last)
    nextIndex = currentPlayerIndex + 1;
    if (nextIndex >= players.length) {
      nextIndex = players.length - 1; // Stay at last player (done with phase)
    }
  }

  return {
    ...gameState,
    currentPlayerIndex: nextIndex,
  };
}

/**
 * Check if current phase is complete and ready to advance
 */
export function isPhaseComplete(gameState: GameState): boolean {
  const { phase, currentPlayerIndex, players } = gameState;

  switch (phase) {
    case 'setup':
      return false; // Manual transition from setup

    case 'determine-player-order':
      return true; // This phase is instant

    case 'auction-power-plants':
      // TODO: Implement proper auction completion logic
      // For now, assume all players acted
      return currentPlayerIndex >= players.length - 1;

    case 'buy-resources':
    case 'build-network':
      // Reverse order: complete when we reach index 0
      return currentPlayerIndex === 0;

    case 'bureaucracy':
      // All players processed
      return currentPlayerIndex >= players.length - 1;

    case 'game-over':
      return true;

    default:
      return false;
  }
}

/**
 * Check if game end conditions are met
 */
export function checkGameEnd(gameState: GameState): boolean {
  const config = PLAYER_CONFIG[gameState.players.length] || PLAYER_CONFIG[4];

  // Game ends if any player has reached the trigger threshold
  const hasWinningPlayer = gameState.players.some(
    (player) => player.cities.length >= config.gameEndTrigger
  );

  // TODO: Also check if not enough plants to refill market

  return hasWinningPlayer;
}

/**
 * Determine the winner
 * Returns player ID of the winner
 */
export function determineWinner(gameState: GameState): string | null {
  if (gameState.players.length === 0) return null;

  // Sort by: cities powered (we'll use connected cities for now), then money, then cities connected
  const sortedPlayers = [...gameState.players].sort((a, b) => {
    // Primary: cities powered (for now, use connected cities)
    // TODO: This should be actual cities powered in final bureaucracy
    if (b.cities.length !== a.cities.length) {
      return b.cities.length - a.cities.length;
    }

    // Tiebreaker 1: money
    if (b.money !== a.money) {
      return b.money - a.money;
    }

    // Tiebreaker 2: cities connected (already compared above)
    return 0;
  });

  return sortedPlayers[0].id;
}
