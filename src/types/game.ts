// Resource types in Power Grid
export type ResourceType = 'coal' | 'oil' | 'garbage' | 'uranium';

// Power plant that uses resources to generate electricity
export interface PowerPlant {
  number: number; // Plant number (also determines auction order)
  resourceType: ResourceType | 'hybrid' | 'eco'; // Type of resource it uses
  resourceCost: number; // How many resources needed to power
  citiesPowered: number; // How many cities it can power
}

// City on the map
export interface City {
  id: string;
  name: string;
  region: string;
  connections: Connection[];
}

// Connection between cities with cost
export interface Connection {
  cityId: string;
  cost: number;
}

// Resource market state
export interface ResourceMarket {
  coal: number[];
  oil: number[];
  garbage: number[];
  uranium: number[];
}

// Player in the game
export interface Player {
  id: string;
  name: string;
  color: string;
  money: number;
  powerPlants: PowerPlant[];
  cities: string[]; // City IDs that player has connected
  resources: {
    coal: number;
    oil: number;
    garbage: number;
    uranium: number;
  };
}

// Game phases
export type GamePhase =
  | 'setup'
  | 'determine-player-order'
  | 'auction-power-plants'
  | 'buy-resources'
  | 'build-network'
  | 'bureaucracy'
  | 'game-over';

// Game state
export interface GameState {
  phase: GamePhase;
  round: number;
  players: Player[];
  currentPlayerIndex: number;
  powerPlantMarket: {
    current: PowerPlant[];
    future: PowerPlant[];
    deck: PowerPlant[];
  };
  resourceMarket: ResourceMarket;
  cities: City[];
  step: 1 | 2 | 3; // Game progresses through 3 steps
  firstPlayerToReachThreshold: string | null;
}

// Auction state
export interface AuctionState {
  plant: PowerPlant;
  currentBid: number;
  currentBidder: string | null;
  activePlayers: string[]; // Players still in the auction
  passedPlayers: string[]; // Players who passed
}
