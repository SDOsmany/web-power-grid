import type { GameState, Player, ResourceMarket } from '../types/game';
import { ALL_POWER_PLANTS, STEP_3_CARD } from './powerPlants';
import { USA_MAP } from './map';

// Player colors
const PLAYER_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

// Initialize resource market
function initializeResourceMarket(): ResourceMarket {
  return {
    coal: [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6],
    oil: [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6],
    garbage: [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6],
    uranium: [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6],
  };
}

// Shuffle array
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Initialize game state
export function initializeGame(playerNames: string[]): GameState {
  // Create players
  const players: Player[] = playerNames.map((name, index) => ({
    id: `player-${index}`,
    name,
    color: PLAYER_COLORS[index],
    money: 50, // Starting money
    powerPlants: [],
    cities: [],
    resources: {
      coal: 0,
      oil: 0,
      garbage: 0,
      uranium: 0,
    },
  }));

  // Prepare power plant deck
  const numPlayers = players.length;

  // Remove certain plants based on player count
  let availablePlants = [...ALL_POWER_PLANTS];
  if (numPlayers <= 4) {
    // Remove some high-numbered plants for smaller games
    availablePlants = availablePlants.filter((p) => p.number !== 42);
  }

  // Sort plants by number
  availablePlants.sort((a, b) => a.number - b.number);

  // Remove lowest numbered plants based on player count
  const plantsToRemove = numPlayers === 2 ? 8 : numPlayers === 3 ? 8 : numPlayers === 4 ? 4 : 0;
  availablePlants = availablePlants.slice(plantsToRemove);

  // Insert Step 3 card at the bottom of the deck
  const shuffledDeck = shuffle(availablePlants);
  shuffledDeck.push(STEP_3_CARD);

  // Set up initial market: 8 plants visible (4 current, 4 future)
  const currentMarket = shuffledDeck.slice(0, 4);
  const futureMarket = shuffledDeck.slice(4, 8);
  const deck = shuffledDeck.slice(8);

  return {
    phase: 'setup',
    round: 1,
    players,
    currentPlayerIndex: 0,
    powerPlantMarket: {
      current: currentMarket,
      future: futureMarket,
      deck,
    },
    resourceMarket: initializeResourceMarket(),
    cities: USA_MAP,
    step: 1,
    firstPlayerToReachThreshold: null,
  };
}

// Helper to get current player
export function getCurrentPlayer(gameState: GameState): Player {
  return gameState.players[gameState.currentPlayerIndex];
}

// Helper to advance to next player
export function advanceToNextPlayer(gameState: GameState): GameState {
  return {
    ...gameState,
    currentPlayerIndex: (gameState.currentPlayerIndex + 1) % gameState.players.length,
  };
}

// Helper to determine player order (based on cities connected and highest plant)
export function determinePlayerOrder(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    // First by number of cities
    if (b.cities.length !== a.cities.length) {
      return b.cities.length - a.cities.length;
    }
    // Then by highest plant number
    const aHighest = Math.max(...a.powerPlants.map((p) => p.number), 0);
    const bHighest = Math.max(...b.powerPlants.map((p) => p.number), 0);
    return bHighest - aHighest;
  });
}
