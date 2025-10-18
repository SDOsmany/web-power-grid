import type { GameState, Player, ResourceType } from '../types/game';

/**
 * Resource purchasing manager
 * Handles buying resources from the market and storing them on power plants
 */

/**
 * Calculate the cost to purchase a resource
 * Resources are priced based on their position in the market (scarcity)
 */
export function getResourceCost(
  gameState: GameState,
  resourceType: ResourceType
): number | null {
  const market = gameState.resourceMarket[resourceType];
  if (market.length === 0) {
    return null; // No resources available
  }
  // Return the price of the cheapest available resource
  return market[0];
}

/**
 * Get available storage space on a player's power plants for a resource type
 */
export function getAvailableStorage(
  player: Player,
  resourceType: ResourceType
): number {
  let totalCapacity = 0;
  let currentlyStored = 0;

  player.powerPlants.forEach((plant) => {
    // Check if plant can use this resource
    const canUseResource =
      plant.resourceType === resourceType ||
      (plant.resourceType === 'hybrid' && (resourceType === 'coal' || resourceType === 'oil'));

    if (canUseResource) {
      totalCapacity += plant.resourceStorage;
      // Count stored resources
      if (plant.resourceType === 'hybrid') {
        // For hybrid plants, count both coal and oil
        currentlyStored += (player.resources.coal || 0) + (player.resources.oil || 0);
      } else {
        currentlyStored += player.resources[resourceType] || 0;
      }
    }
  });

  return Math.max(0, totalCapacity - currentlyStored);
}

/**
 * Check if player can afford to purchase a resource
 */
export function canAffordResource(
  gameState: GameState,
  playerId: string,
  resourceType: ResourceType
): boolean {
  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) return false;

  const cost = getResourceCost(gameState, resourceType);
  if (cost === null) return false;

  return player.money >= cost;
}

/**
 * Check if player has storage space for a resource
 */
export function hasStorageSpace(
  gameState: GameState,
  playerId: string,
  resourceType: ResourceType
): boolean {
  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) return false;

  return getAvailableStorage(player, resourceType) > 0;
}

/**
 * Purchase a resource from the market
 * Returns updated game state or null if purchase is invalid
 */
export function purchaseResource(
  gameState: GameState,
  playerId: string,
  resourceType: ResourceType
): GameState | null {
  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) return null;

  // Check if resource is available
  const cost = getResourceCost(gameState, resourceType);
  if (cost === null) return null;

  // Check if player can afford it
  if (player.money < cost) return null;

  // Check if player has storage space
  if (!hasStorageSpace(gameState, playerId, resourceType)) return null;

  // Remove resource from market (cheapest one)
  const newMarket = { ...gameState.resourceMarket };
  newMarket[resourceType] = [...newMarket[resourceType]];
  newMarket[resourceType].shift(); // Remove first (cheapest) resource

  // Update player's money and resources
  const updatedPlayers = gameState.players.map((p) => {
    if (p.id === playerId) {
      return {
        ...p,
        money: p.money - cost,
        resources: {
          ...p.resources,
          [resourceType]: (p.resources[resourceType] || 0) + 1,
        },
      };
    }
    return p;
  });

  return {
    ...gameState,
    players: updatedPlayers,
    resourceMarket: newMarket,
  };
}

/**
 * Get a summary of what resources a player can buy
 */
export interface ResourcePurchaseOption {
  type: ResourceType;
  cost: number | null;
  available: number;
  canAfford: boolean;
  hasStorage: boolean;
  canPurchase: boolean;
}

export function getResourcePurchaseOptions(
  gameState: GameState,
  playerId: string
): ResourcePurchaseOption[] {
  const resourceTypes: ResourceType[] = ['coal', 'oil', 'garbage', 'uranium'];

  return resourceTypes.map((type) => {
    const cost = getResourceCost(gameState, type);
    const available = gameState.resourceMarket[type].length;
    const canAfford = canAffordResource(gameState, playerId, type);
    const hasStorage = hasStorageSpace(gameState, playerId, type);

    return {
      type,
      cost,
      available,
      canAfford,
      hasStorage,
      canPurchase: cost !== null && canAfford && hasStorage,
    };
  });
}

/**
 * Check if a player is done purchasing resources
 * (they've passed or can't buy anymore)
 */
export function isPlayerDonePurchasing(
  gameState: GameState,
  playerId: string
): boolean {
  const options = getResourcePurchaseOptions(gameState, playerId);
  // Player is done if they can't purchase any resources
  return !options.some((opt) => opt.canPurchase);
}
