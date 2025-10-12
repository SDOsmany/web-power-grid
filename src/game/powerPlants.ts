import type { PowerPlant } from '../types/game';

// All power plants in the game (based on the original Power Grid)
export const ALL_POWER_PLANTS: PowerPlant[] = [
  // Starting plants (3-10)
  { number: 3, resourceType: 'oil', resourceCost: 2, citiesPowered: 1 },
  { number: 4, resourceType: 'coal', resourceCost: 2, citiesPowered: 1 },
  { number: 5, resourceType: 'hybrid', resourceCost: 2, citiesPowered: 1 },
  { number: 6, resourceType: 'garbage', resourceCost: 1, citiesPowered: 1 },
  { number: 7, resourceType: 'oil', resourceCost: 3, citiesPowered: 2 },
  { number: 8, resourceType: 'coal', resourceCost: 3, citiesPowered: 2 },
  { number: 9, resourceType: 'oil', resourceCost: 1, citiesPowered: 1 },
  { number: 10, resourceType: 'coal', resourceCost: 2, citiesPowered: 2 },

  // Mid-game plants (11-20)
  { number: 11, resourceType: 'uranium', resourceCost: 1, citiesPowered: 2 },
  { number: 12, resourceType: 'hybrid', resourceCost: 2, citiesPowered: 2 },
  { number: 13, resourceType: 'eco', resourceCost: 0, citiesPowered: 1 },
  { number: 14, resourceType: 'garbage', resourceCost: 2, citiesPowered: 2 },
  { number: 15, resourceType: 'coal', resourceCost: 2, citiesPowered: 3 },
  { number: 16, resourceType: 'oil', resourceCost: 2, citiesPowered: 3 },
  { number: 17, resourceType: 'uranium', resourceCost: 1, citiesPowered: 2 },
  { number: 18, resourceType: 'eco', resourceCost: 0, citiesPowered: 2 },
  { number: 19, resourceType: 'garbage', resourceCost: 2, citiesPowered: 3 },
  { number: 20, resourceType: 'coal', resourceCost: 3, citiesPowered: 5 },

  // Late-game plants (21-30)
  { number: 21, resourceType: 'hybrid', resourceCost: 2, citiesPowered: 4 },
  { number: 22, resourceType: 'eco', resourceCost: 0, citiesPowered: 2 },
  { number: 23, resourceType: 'uranium', resourceCost: 1, citiesPowered: 3 },
  { number: 24, resourceType: 'garbage', resourceCost: 2, citiesPowered: 4 },
  { number: 25, resourceType: 'coal', resourceCost: 2, citiesPowered: 5 },
  { number: 26, resourceType: 'oil', resourceCost: 2, citiesPowered: 5 },
  { number: 27, resourceType: 'eco', resourceCost: 0, citiesPowered: 3 },
  { number: 28, resourceType: 'uranium', resourceCost: 1, citiesPowered: 4 },
  { number: 29, resourceType: 'hybrid', resourceCost: 1, citiesPowered: 4 },
  { number: 30, resourceType: 'garbage', resourceCost: 3, citiesPowered: 6 },

  // End-game plants (31-40)
  { number: 31, resourceType: 'coal', resourceCost: 3, citiesPowered: 6 },
  { number: 32, resourceType: 'oil', resourceCost: 3, citiesPowered: 6 },
  { number: 33, resourceType: 'eco', resourceCost: 0, citiesPowered: 4 },
  { number: 34, resourceType: 'uranium', resourceCost: 1, citiesPowered: 5 },
  { number: 35, resourceType: 'oil', resourceCost: 1, citiesPowered: 5 },
  { number: 36, resourceType: 'coal', resourceCost: 3, citiesPowered: 7 },
  { number: 37, resourceType: 'eco', resourceCost: 0, citiesPowered: 4 },
  { number: 38, resourceType: 'garbage', resourceCost: 3, citiesPowered: 7 },
  { number: 39, resourceType: 'uranium', resourceCost: 1, citiesPowered: 6 },
  { number: 40, resourceType: 'oil', resourceCost: 2, citiesPowered: 6 },

  // High-end plants (42-50)
  { number: 42, resourceType: 'coal', resourceCost: 2, citiesPowered: 6 },
  { number: 44, resourceType: 'eco', resourceCost: 0, citiesPowered: 5 },
  { number: 46, resourceType: 'hybrid', resourceCost: 3, citiesPowered: 7 },
  { number: 50, resourceType: 'eco', resourceCost: 0, citiesPowered: 6 },
];

// Step 3 card - triggers end game
export const STEP_3_CARD: PowerPlant = {
  number: 999, // Special number to identify Step 3 card
  resourceType: 'eco',
  resourceCost: 0,
  citiesPowered: 0,
};
