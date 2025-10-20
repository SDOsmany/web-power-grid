import type { GameState, Player, City } from '../types/game';

/**
 * Network Building Manager
 * Handles city connections, cost calculations, and building validation
 */

/**
 * Get cities that a player can build in
 * Returns cities that are either:
 * - Empty (no houses) OR
 * - Have space for more houses based on current step
 */
export function getBuildableCities(gameState: GameState, playerId: string): City[] {
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return [];

  const maxHousesPerCity = gameState.step; // Step 1 = 1 house, Step 2 = 2 houses, Step 3 = 3 houses

  return gameState.cities.filter(city => {
    // Count houses in this city
    const housesInCity = gameState.players.filter(p =>
      p.cities.some(c => c.id === city.id)
    ).length;

    // Can't build if city is full
    if (housesInCity >= maxHousesPerCity) {
      return false;
    }

    // Can't build if player already has a house here
    if (player.cities.some(c => c.id === city.id)) {
      return false;
    }

    return true;
  });
}

/**
 * Calculate the cost to build in a city
 * Returns: { houseCost, connectionCost, totalCost }
 */
export function calculateBuildCost(
  gameState: GameState,
  playerId: string,
  cityId: string
): { houseCost: number; connectionCost: number; totalCost: number } | null {
  const player = gameState.players.find(p => p.id === playerId);
  const city = gameState.cities.find(c => c.id === cityId);

  if (!player || !city) return null;

  // Count existing houses in this city
  const housesInCity = gameState.players.filter(p =>
    p.cities.some(c => c.id === city.id)
  ).length;

  // House cost based on how many houses already in city
  let houseCost: number;
  if (housesInCity === 0) {
    houseCost = 10; // First house
  } else if (housesInCity === 1) {
    houseCost = 15; // Second house (Step 2)
  } else {
    houseCost = 20; // Third house (Step 3)
  }

  // Connection cost
  let connectionCost = 0;

  // If player has no cities yet, no connection cost
  if (player.cities.length === 0) {
    connectionCost = 0;
  } else {
    // Find cheapest connection from player's existing network
    connectionCost = findCheapestConnection(gameState, player, cityId);
  }

  return {
    houseCost,
    connectionCost,
    totalCost: houseCost + connectionCost,
  };
}

/**
 * Find the cheapest connection cost from player's network to a target city
 * Uses Dijkstra's algorithm to find shortest path
 */
function findCheapestConnection(
  gameState: GameState,
  player: Player,
  targetCityId: string
): number {
  // Get all city IDs in player's network
  const networkCityIds = player.cities.map(c => c.id);

  let minCost = Infinity;

  // Try connecting from each city in player's network
  for (const startCityId of networkCityIds) {
    const cost = findShortestPath(gameState, startCityId, targetCityId);
    if (cost < minCost) {
      minCost = cost;
    }
  }

  return minCost === Infinity ? 0 : minCost;
}

/**
 * Find shortest path between two cities using Dijkstra's algorithm
 */
function findShortestPath(
  gameState: GameState,
  startCityId: string,
  endCityId: string
): number {
  if (startCityId === endCityId) return 0;

  // Build adjacency list
  const distances: Record<string, number> = {};
  const visited = new Set<string>();
  const queue: string[] = [];

  // Initialize distances
  gameState.cities.forEach(city => {
    distances[city.id] = Infinity;
  });
  distances[startCityId] = 0;
  queue.push(startCityId);

  while (queue.length > 0) {
    // Find city with minimum distance
    let currentCityId = queue[0];
    let minDist = distances[currentCityId];
    for (const cityId of queue) {
      if (distances[cityId] < minDist) {
        minDist = distances[cityId];
        currentCityId = cityId;
      }
    }

    // Remove from queue
    queue.splice(queue.indexOf(currentCityId), 1);

    // Mark as visited
    visited.add(currentCityId);

    // Found target
    if (currentCityId === endCityId) {
      return distances[endCityId];
    }

    // Get current city
    const currentCity = gameState.cities.find(c => c.id === currentCityId);
    if (!currentCity) continue;

    // Update distances for neighbors
    for (const connection of currentCity.connections) {
      const neighborId = connection.cityId;

      if (visited.has(neighborId)) continue;

      const newDistance = distances[currentCityId] + connection.cost;

      if (newDistance < distances[neighborId]) {
        distances[neighborId] = newDistance;
        if (!queue.includes(neighborId)) {
          queue.push(neighborId);
        }
      }
    }
  }

  return Infinity; // No path found
}

/**
 * Check if player can afford to build in a city
 */
export function canAffordToBuild(
  gameState: GameState,
  playerId: string,
  cityId: string
): boolean {
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return false;

  const cost = calculateBuildCost(gameState, playerId, cityId);
  if (!cost) return false;

  return player.money >= cost.totalCost;
}

/**
 * Build a house in a city
 * Deducts money and adds city to player's network
 */
export function buildInCity(
  gameState: GameState,
  playerId: string,
  cityId: string
): GameState | null {
  const player = gameState.players.find(p => p.id === playerId);
  const city = gameState.cities.find(c => c.id === cityId);

  if (!player || !city) return null;

  // Calculate cost
  const cost = calculateBuildCost(gameState, playerId, cityId);
  if (!cost) return null;

  // Check if can afford
  if (player.money < cost.totalCost) return null;

  // Check if city is buildable
  const buildableCities = getBuildableCities(gameState, playerId);
  if (!buildableCities.some(c => c.id === cityId)) return null;

  // Update player
  const updatedPlayers = gameState.players.map(p => {
    if (p.id === playerId) {
      return {
        ...p,
        money: p.money - cost.totalCost,
        cities: [...p.cities, city],
      };
    }
    return p;
  });

  return {
    ...gameState,
    players: updatedPlayers,
  };
}

/**
 * Check if it's the first round (building phase is skipped)
 */
export function shouldSkipBuildingPhase(gameState: GameState): boolean {
  return gameState.round === 1;
}
