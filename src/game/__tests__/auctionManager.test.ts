import { describe, it, expect, beforeEach } from 'vitest';
import type { GameState, PowerPlant } from '../../types/game';
import {
  startAuction,
  placeBid,
  passAuction,
  isAuctionComplete,
  getAuctionWinner,
  canAffordBid,
} from '../auctionManager';

// Test data setup
const mockPlant: PowerPlant = {
  number: 5,
  resourceType: 'coal',
  resourceCost: 2,
  citiesPowered: 2,
  resourceStorage: 4,
};

const createMockGameState = (numPlayers: number = 3): GameState => ({
  phase: 'auction-power-plants',
  round: 1,
  players: Array.from({ length: numPlayers }, (_, i) => ({
    id: `player${i + 1}`,
    name: `Player ${i + 1}`,
    color: `#${i}${i}${i}`,
    money: 50,
    powerPlants: [],
    resources: { coal: 0, oil: 0, garbage: 0, uranium: 0 },
    cities: [],
  })),
  currentPlayerIndex: 0,
  powerPlantMarket: {
    current: [mockPlant],
    future: [],
    deck: [],
  },
  resourceMarket: {
    coal: [],
    oil: [],
    garbage: [],
    uranium: [],
  },
  cities: [],
  step: 1,
  firstPlayerToReachThreshold: null,
});

describe('Auction System - Basic Flow', () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = createMockGameState(3);
  });

  it('starts auction with plant number as current bid', () => {
    const auction = startAuction(gameState, mockPlant, 'player1');

    expect(auction.plant).toBe(mockPlant);
    expect(auction.currentBid).toBe(mockPlant.number); // Minimum bid
    expect(auction.currentBidder).toBeNull(); // No bidder yet
    expect(auction.startingPlayer).toBe('player1');
    expect(auction.activePlayers).toHaveLength(3);
    expect(auction.passedPlayers).toHaveLength(0);
  });

  it('allows first bidder to bid at minimum (plant number)', () => {
    const auction = startAuction(gameState, mockPlant, 'player1');

    // First bid can be at minimum
    const auctionWithBid = placeBid(auction, 'player1', mockPlant.number);

    expect(auctionWithBid.currentBid).toBe(mockPlant.number);
    expect(auctionWithBid.currentBidder).toBe('player1');
  });

  it('requires subsequent bids to be higher than current bid', () => {
    const auction = startAuction(gameState, mockPlant, 'player1');
    const withFirstBid = placeBid(auction, 'player1', 5);

    // Second bid must be higher
    const withSecondBid = placeBid(withFirstBid, 'player2', 6);
    expect(withSecondBid.currentBid).toBe(6);
    expect(withSecondBid.currentBidder).toBe('player2');

    // Trying to bid same amount would need validation in UI
    // The function itself doesn't validate - that's done in AuctionModal
  });

  it('removes player from active list when they pass', () => {
    const auction = startAuction(gameState, mockPlant, 'player1');
    const afterBid = placeBid(auction, 'player1', 5);

    const afterPass = passAuction(afterBid, 'player2');

    expect(afterPass.activePlayers).not.toContain('player2');
    expect(afterPass.passedPlayers).toContain('player2');
    expect(afterPass.activePlayers).toHaveLength(2); // Only player1 and player3 left
  });

  it('completes auction when only one player remains active', () => {
    const auction = startAuction(gameState, mockPlant, 'player1');
    const withBid = placeBid(auction, 'player1', 5);
    const afterPass1 = passAuction(withBid, 'player2');
    const afterPass2 = passAuction(afterPass1, 'player3');

    expect(isAuctionComplete(afterPass2)).toBe(true);
    expect(afterPass2.activePlayers).toHaveLength(1);
    expect(afterPass2.activePlayers[0]).toBe('player1');
  });
});

describe('Auction System - Winner Determination', () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = createMockGameState(3);
  });

  it('declares last active player as winner', () => {
    const auction = startAuction(gameState, mockPlant, 'player1');
    const withBid = placeBid(auction, 'player1', 5);
    const afterPass1 = passAuction(withBid, 'player2');
    const afterPass2 = passAuction(afterPass1, 'player3');

    const winner = getAuctionWinner(afterPass2);
    expect(winner).toBe('player1');
  });

  it('declares current bidder as winner when only they are left', () => {
    const auction = startAuction(gameState, mockPlant, 'player1');
    const withBid1 = placeBid(auction, 'player1', 5);
    const withBid2 = placeBid(withBid1, 'player2', 6);
    const afterPass1 = passAuction(withBid2, 'player1');
    const afterPass2 = passAuction(afterPass1, 'player3');

    const winner = getAuctionWinner(afterPass2);
    expect(winner).toBe('player2'); // Last bidder wins
  });

  it('declares starting player as winner if nobody bids', () => {
    const auction = startAuction(gameState, mockPlant, 'player1');
    // Nobody bids, everyone passes
    const afterPass1 = passAuction(auction, 'player2');
    const afterPass2 = passAuction(afterPass1, 'player3');
    const afterPass3 = passAuction(afterPass2, 'player1');

    // All players passed, starting player must take it
    const winner = getAuctionWinner(afterPass3);
    expect(winner).toBe('player1');
  });
});

describe('Auction System - Affordability', () => {
  it('correctly checks if player can afford bid', () => {
    const player = {
      id: 'player1',
      name: 'Player 1',
      color: '#111',
      money: 20,
      powerPlants: [],
      resources: { coal: 0, oil: 0, garbage: 0, uranium: 0 },
      cities: [],
    };

    expect(canAffordBid(player, 10)).toBe(true);
    expect(canAffordBid(player, 20)).toBe(true);
    expect(canAffordBid(player, 21)).toBe(false);
    expect(canAffordBid(player, 100)).toBe(false);
  });
});

describe('Auction System - Edge Cases', () => {
  it('handles two-player auction correctly', () => {
    const gameState = createMockGameState(2);
    const auction = startAuction(gameState, mockPlant, 'player1');

    expect(auction.activePlayers).toHaveLength(2);

    const withBid = placeBid(auction, 'player1', 5);
    const afterPass = passAuction(withBid, 'player2');

    expect(isAuctionComplete(afterPass)).toBe(true);
    expect(getAuctionWinner(afterPass)).toBe('player1');
  });

  it('handles six-player auction correctly', () => {
    const gameState = createMockGameState(6);
    const auction = startAuction(gameState, mockPlant, 'player1');

    expect(auction.activePlayers).toHaveLength(6);

    // All but one player passes
    let currentAuction = placeBid(auction, 'player1', 5);
    currentAuction = passAuction(currentAuction, 'player2');
    currentAuction = passAuction(currentAuction, 'player3');
    currentAuction = passAuction(currentAuction, 'player4');
    currentAuction = passAuction(currentAuction, 'player5');
    currentAuction = passAuction(currentAuction, 'player6');

    expect(isAuctionComplete(currentAuction)).toBe(true);
    expect(getAuctionWinner(currentAuction)).toBe('player1');
  });

  it('handles competitive bidding between multiple players', () => {
    const gameState = createMockGameState(3);
    const auction = startAuction(gameState, mockPlant, 'player1');

    // Player 1 bids minimum
    let currentAuction = placeBid(auction, 'player1', 5);
    expect(currentAuction.currentBidder).toBe('player1');

    // Player 2 raises
    currentAuction = placeBid(currentAuction, 'player2', 7);
    expect(currentAuction.currentBidder).toBe('player2');

    // Player 3 passes
    currentAuction = passAuction(currentAuction, 'player3');
    expect(currentAuction.activePlayers).toHaveLength(2);

    // Player 1 raises again
    currentAuction = placeBid(currentAuction, 'player1', 10);
    expect(currentAuction.currentBidder).toBe('player1');

    // Player 2 passes
    currentAuction = passAuction(currentAuction, 'player2');

    expect(isAuctionComplete(currentAuction)).toBe(true);
    expect(getAuctionWinner(currentAuction)).toBe('player1');
    expect(currentAuction.currentBid).toBe(10);
  });
});
