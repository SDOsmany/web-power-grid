import { describe, it, expect } from 'vitest';
import type { GameState, PowerPlant } from '../../types/game';
import {
  startAuction,
  placeBid,
  passAuction,
  isAuctionComplete,
  getAuctionWinner,
  getNextAuctionPlayer,
} from '../auctionManager';

// Test data
const mockPlant: PowerPlant = {
  number: 5,
  resourceType: 'coal',
  resourceCost: 2,
  citiesPowered: 2,
  resourceStorage: 4,
};

const createMockGameState = (): GameState => ({
  phase: 'auction-power-plants',
  round: 1,
  players: [
    {
      id: 'playerA',
      name: 'Player A',
      color: '#111',
      money: 50,
      powerPlants: [],
      resources: { coal: 0, oil: 0, garbage: 0, uranium: 0 },
      cities: [],
    },
    {
      id: 'playerB',
      name: 'Player B',
      color: '#222',
      money: 50,
      powerPlants: [],
      resources: { coal: 0, oil: 0, garbage: 0, uranium: 0 },
      cities: [],
    },
    {
      id: 'playerC',
      name: 'Player C',
      color: '#333',
      money: 50,
      powerPlants: [],
      resources: { coal: 0, oil: 0, garbage: 0, uranium: 0 },
      cities: [],
    },
  ],
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
  playersWhoHaveBoughtThisRound: [],
});

describe('Auction Flow - Correct Bidding Order', () => {
  it('Scenario 1: Player A wins after competitive bidding with C', () => {
    const gameState = createMockGameState();

    // Player A's turn to SELECT a plant
    const auction = startAuction(gameState, mockPlant, 'playerA');

    // BIDDING ORDER: A → B → C → (back to) A → (back to) C
    // Player A bids 5 (minimum)
    let currentAuction = placeBid(auction, 'playerA', 5);
    expect(currentAuction.currentBid).toBe(5);
    expect(currentAuction.currentBidder).toBe('playerA');

    // Next to bid should be Player B
    let nextPlayer = getNextAuctionPlayer(currentAuction, 'playerA', gameState.players);
    expect(nextPlayer).toBe('playerB');

    // Player B passes
    currentAuction = passAuction(currentAuction, 'playerB');
    expect(currentAuction.activePlayers).not.toContain('playerB');

    // Next to bid should be Player C (NOT back to A!)
    nextPlayer = getNextAuctionPlayer(currentAuction, 'playerB', gameState.players);
    expect(nextPlayer).toBe('playerC');

    // Player C bids 6
    currentAuction = placeBid(currentAuction, 'playerC', 6);
    expect(currentAuction.currentBid).toBe(6);
    expect(currentAuction.currentBidder).toBe('playerC');

    // Next to bid should be Player A (circle back)
    nextPlayer = getNextAuctionPlayer(currentAuction, 'playerC', gameState.players);
    expect(nextPlayer).toBe('playerA');

    // Player A bids 7
    currentAuction = placeBid(currentAuction, 'playerA', 7);
    expect(currentAuction.currentBid).toBe(7);

    // Next to bid should be Player C (B already passed)
    nextPlayer = getNextAuctionPlayer(currentAuction, 'playerA', gameState.players);
    expect(nextPlayer).toBe('playerC');

    // Player C passes
    currentAuction = passAuction(currentAuction, 'playerC');

    // Auction should be complete
    expect(isAuctionComplete(currentAuction)).toBe(true);
    expect(getAuctionWinner(currentAuction)).toBe('playerA');
  });

  it('Scenario 2: Player A wins when B and C both pass immediately', () => {
    const gameState = createMockGameState();
    const auction = startAuction(gameState, mockPlant, 'playerA');

    // Player A bids 5 (minimum)
    let currentAuction = placeBid(auction, 'playerA', 5);

    // Player B passes
    currentAuction = passAuction(currentAuction, 'playerB');

    // Next should be C (not back to A)
    const nextPlayer = getNextAuctionPlayer(currentAuction, 'playerB', gameState.players);
    expect(nextPlayer).toBe('playerC');

    // Player C passes
    currentAuction = passAuction(currentAuction, 'playerC');

    // Auction complete, A wins
    expect(isAuctionComplete(currentAuction)).toBe(true);
    expect(getAuctionWinner(currentAuction)).toBe('playerA');
  });

  it('Scenario 3: Competitive bidding between A and B, A wins, B gets leftover', () => {
    const gameState = createMockGameState();
    const auction = startAuction(gameState, mockPlant, 'playerA');

    // PLAYER A's AUCTION TURN
    // A bids 5
    let currentAuction = placeBid(auction, 'playerA', 5);

    // B bids 6
    currentAuction = placeBid(currentAuction, 'playerB', 6);

    // C passes
    currentAuction = passAuction(currentAuction, 'playerC');

    // Back to A, bids 7
    currentAuction = placeBid(currentAuction, 'playerA', 7);

    // Back to B, bids 8
    currentAuction = placeBid(currentAuction, 'playerB', 8);

    // Back to A, bids 9
    currentAuction = placeBid(currentAuction, 'playerA', 9);

    // B passes
    currentAuction = passAuction(currentAuction, 'playerB');

    // A wins
    expect(isAuctionComplete(currentAuction)).toBe(true);
    expect(getAuctionWinner(currentAuction)).toBe('playerA');

    // NOW it should be PLAYER B's turn to select a plant
    // (This is tested at the component level, not here)
  });

  it('handles 3-way competitive bidding correctly', () => {
    const gameState = createMockGameState();
    const auction = startAuction(gameState, mockPlant, 'playerA');

    // All three bid
    let currentAuction = placeBid(auction, 'playerA', 5);
    currentAuction = placeBid(currentAuction, 'playerB', 6);
    currentAuction = placeBid(currentAuction, 'playerC', 7);

    // Back to A, passes
    currentAuction = passAuction(currentAuction, 'playerA');

    // Next should be B (not C, we go in circle)
    let nextPlayer = getNextAuctionPlayer(currentAuction, 'playerA', gameState.players);
    expect(nextPlayer).toBe('playerB');

    // B bids 8
    currentAuction = placeBid(currentAuction, 'playerB', 8);

    // Next to C
    nextPlayer = getNextAuctionPlayer(currentAuction, 'playerB', gameState.players);
    expect(nextPlayer).toBe('playerC');

    // C passes
    currentAuction = passAuction(currentAuction, 'playerC');

    // B wins
    expect(isAuctionComplete(currentAuction)).toBe(true);
    expect(getAuctionWinner(currentAuction)).toBe('playerB');
  });
});

describe('Auction Flow - Turn Management', () => {
  it('distinguishes between auction turn and bidding turn', () => {
    /**
     * KEY CONCEPTS:
     * - "Auction Turn" = Whose turn to SELECT a plant
     * - "Bidding Turn" = Whose turn to BID in current auction
     *
     * These are DIFFERENT!
     */

    const gameState = createMockGameState();

    // It's Player A's "auction turn" (they select the plant)
    expect(gameState.currentPlayerIndex).toBe(0); // Player A

    // But during bidding, the "bidding turn" rotates A → B → C → A...
    const auction = startAuction(gameState, mockPlant, 'playerA');

    // All three players are "active" in bidding
    expect(auction.activePlayers).toHaveLength(3);
    expect(auction.activePlayers).toContain('playerA');
    expect(auction.activePlayers).toContain('playerB');
    expect(auction.activePlayers).toContain('playerC');

    // After auction completes, it becomes Player B's "auction turn"
    // (This transition is handled by completeAuction in AuctionModal)
  });
});

describe('Auction Flow - Edge Cases', () => {
  it('handles when starting player is only one left (already passed out earlier)', () => {
    const gameState = createMockGameState();
    const auction = startAuction(gameState, mockPlant, 'playerB');

    // B bids, A passes, C passes
    let currentAuction = placeBid(auction, 'playerB', 5);
    currentAuction = passAuction(currentAuction, 'playerC');
    currentAuction = passAuction(currentAuction, 'playerA');

    expect(isAuctionComplete(currentAuction)).toBe(true);
    expect(getAuctionWinner(currentAuction)).toBe('playerB');
  });

  it('handles when nobody bids and starting player must take it', () => {
    const gameState = createMockGameState();
    const auction = startAuction(gameState, mockPlant, 'playerA');

    // A doesn't bid yet, B passes, C passes, back to A who must take it
    const afterBPass = passAuction(auction, 'playerB');
    const afterCPass = passAuction(afterBPass, 'playerC');
    const afterAPass = passAuction(afterCPass, 'playerA');

    // Starting player wins at minimum bid
    expect(getAuctionWinner(afterAPass)).toBe('playerA');
  });
});
