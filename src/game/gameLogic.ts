import type { GameState, Player, ResourceMarket } from '../types/game';
import { ALL_POWER_PLANTS, STEP_3_CARD } from './powerPlants';
import { USA_MAP } from './map';

// Player colors
const PLAYER_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

// Player count specific configuration (OFFICIAL RULES)
interface PlayerCountConfig {
  regions: number;
  plantsToRemove: number;
  maxPlantsPerPlayer: number;
  step2Trigger: number; // Number of cities to trigger Step 2
  gameEndTrigger: number; // Number of cities to end game
}

export const PLAYER_CONFIG: Record<number, PlayerCountConfig> = {
  2: { regions: 3, plantsToRemove: 8, maxPlantsPerPlayer: 4, step2Trigger: 10, gameEndTrigger: 21 },
  3: { regions: 3, plantsToRemove: 8, maxPlantsPerPlayer: 3, step2Trigger: 7, gameEndTrigger: 17 },
  4: { regions: 4, plantsToRemove: 4, maxPlantsPerPlayer: 3, step2Trigger: 7, gameEndTrigger: 17 },
  5: { regions: 5, plantsToRemove: 0, maxPlantsPerPlayer: 3, step2Trigger: 7, gameEndTrigger: 15 },
  6: { regions: 5, plantsToRemove: 0, maxPlantsPerPlayer: 3, step2Trigger: 6, gameEndTrigger: 14 },
};

// Resource refill amounts by step and player count (OFFICIAL RULES)
interface ResourceRefill {
  coal: number;
  oil: number;
  garbage: number;
  uranium: number;
}

export const RESOURCE_REFILL: Record<1 | 2 | 3, Record<number, ResourceRefill>> = {
  1: {
    // Step 1
    2: { coal: 3, oil: 2, garbage: 1, uranium: 1 },
    3: { coal: 4, oil: 2, garbage: 1, uranium: 1 },
    4: { coal: 5, oil: 3, garbage: 2, uranium: 1 },
    5: { coal: 5, oil: 4, garbage: 3, uranium: 2 },
    6: { coal: 7, oil: 5, garbage: 3, uranium: 2 },
  },
  2: {
    // Step 2
    2: { coal: 4, oil: 2, garbage: 2, uranium: 1 },
    3: { coal: 5, oil: 3, garbage: 2, uranium: 2 },
    4: { coal: 6, oil: 4, garbage: 3, uranium: 2 },
    5: { coal: 7, oil: 5, garbage: 4, uranium: 3 },
    6: { coal: 9, oil: 6, garbage: 5, uranium: 3 },
  },
  3: {
    // Step 3
    2: { coal: 3, oil: 4, garbage: 3, uranium: 1 },
    3: { coal: 4, oil: 5, garbage: 3, uranium: 2 },
    4: { coal: 5, oil: 6, garbage: 4, uranium: 2 },
    5: { coal: 6, oil: 7, garbage: 5, uranium: 3 },
    6: { coal: 7, oil: 9, garbage: 6, uranium: 4 },
  },
};

// Initialize resource market (OFFICIAL RULES)
// Coal: 3 on spaces 1-8 (24 total)
// Oil: 3 on spaces 3-8 (18 total)
// Garbage: 3 on spaces 7-8 (6 total)
// Uranium: 1 on spaces 14 and 16 (2 total)
function initializeResourceMarket(): ResourceMarket {
  return {
    // Coal: 3 each on spaces 1-8 (prices 1-8)
    coal: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
    // Oil: 3 each on spaces 3-8 (prices 3-8)
    oil: [3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
    // Garbage: 3 each on spaces 7-8 (prices 7-8)
    garbage: [7, 7, 7, 8, 8, 8],
    // Uranium: 1 on spaces 14 and 16 (prices 14, 16)
    uranium: [14, 16],
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

  // Prepare power plant deck (OFFICIAL RULES)
  const numPlayers = players.length;
  const config = PLAYER_CONFIG[numPlayers] || PLAYER_CONFIG[4]; // Default to 4-player config

  // 1. Remove plant #13 (eco) - will be placed on top later
  let availablePlants = ALL_POWER_PLANTS.filter((p) => p.number !== 13);

  // 2. Separate plants 3-10 for initial market
  const initialMarketPlants = availablePlants.filter((p) => p.number >= 3 && p.number <= 10);
  const remainingPlants = availablePlants.filter((p) => p.number < 3 || p.number > 10);

  // 3. Randomly remove plants based on player count (face-down)
  const shuffledRemaining = shuffle(remainingPlants);
  const finalDeck = shuffledRemaining.slice(config.plantsToRemove);

  // 4. Sort initial market plants (3-10)
  initialMarketPlants.sort((a, b) => a.number - b.number);

  // 5. Set up market: plants 3-6 in current, 7-10 in future
  const currentMarket = initialMarketPlants.slice(0, 4); // 3, 4, 5, 6
  const futureMarket = initialMarketPlants.slice(4, 8); // 7, 8, 9, 10

  // 6. Prepare deck: shuffled remaining plants
  let deck = shuffle(finalDeck);

  // 7. Place Step 3 card at BOTTOM
  deck.push(STEP_3_CARD);

  // 8. Place plant #13 on TOP
  const plant13 = ALL_POWER_PLANTS.find((p) => p.number === 13);
  if (plant13) {
    deck.unshift(plant13);
  }

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
    playersWhoHaveBoughtThisRound: [], // Reset at start of each auction round
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

// Refill resource market based on step and player count (OFFICIAL RULES)
export function refillResourceMarket(gameState: GameState): GameState {
  const step = gameState.step as 1 | 2 | 3;
  const numPlayers = gameState.players.length;
  const refillAmounts = RESOURCE_REFILL[step][numPlayers] || RESOURCE_REFILL[step][4];

  const newMarket = { ...gameState.resourceMarket };

  // Add resources to market (cheapest spaces first)
  // Coal: Add to spaces 1-8 (prices 1-8), max 3 per space
  for (let i = 0; i < refillAmounts.coal; i++) {
    const price = Math.ceil((newMarket.coal.length + 1) / 3);
    if (price <= 8) {
      newMarket.coal.push(price);
    }
  }

  // Oil: Add to spaces 3-8 (prices 3-8), max 3 per space
  for (let i = 0; i < refillAmounts.oil; i++) {
    const price = Math.ceil((newMarket.oil.length + 1) / 3) + 2; // Starts at 3
    if (price <= 8) {
      newMarket.oil.push(price);
    }
  }

  // Garbage: Add to spaces 7-8 (prices 7-8), max 3 per space
  for (let i = 0; i < refillAmounts.garbage; i++) {
    const price = Math.ceil((newMarket.garbage.length + 1) / 3) + 6; // Starts at 7
    if (price <= 8) {
      newMarket.garbage.push(price);
    }
  }

  // Uranium: Add to spaces 14-16, max 1 per space, fill from highest down
  for (let i = 0; i < refillAmounts.uranium; i++) {
    // Uranium spaces: [14, 16] (we fill from 16 down, but simplified for now)
    if (newMarket.uranium.length < 2) {
      // Add at highest available space
      const existingPrices = newMarket.uranium;
      if (!existingPrices.includes(16)) {
        newMarket.uranium.push(16);
      } else if (!existingPrices.includes(14)) {
        newMarket.uranium.push(14);
      }
    }
  }

  // Sort resources by price (cheapest first)
  newMarket.coal.sort((a, b) => a - b);
  newMarket.oil.sort((a, b) => a - b);
  newMarket.garbage.sort((a, b) => a - b);
  newMarket.uranium.sort((a, b) => a - b);

  return {
    ...gameState,
    resourceMarket: newMarket,
  };
}
