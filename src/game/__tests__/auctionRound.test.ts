import { describe, it, expect, beforeEach } from 'vitest';
import type { GameState, PowerPlant } from '../../types/game';
import {
  markPlayerAsBought,
  getNextPlayerForAuction,
  shouldAuctionPhaseEnd,
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
  playersWhoHaveBoughtThisRound: [],
});

describe('Auction Round Management', () => {
  describe('markPlayerAsBought', () => {
    it('adds player to bought list', () => {
      const gameState = createMockGameState(3);
      const newState = markPlayerAsBought(gameState, 'player1');

      expect(newState.playersWhoHaveBoughtThisRound).toContain('player1');
      expect(newState.playersWhoHaveBoughtThisRound).toHaveLength(1);
    });

    it('preserves existing bought players', () => {
      let gameState = createMockGameState(3);
      gameState = markPlayerAsBought(gameState, 'player1');
      gameState = markPlayerAsBought(gameState, 'player2');

      expect(gameState.playersWhoHaveBoughtThisRound).toContain('player1');
      expect(gameState.playersWhoHaveBoughtThisRound).toContain('player2');
      expect(gameState.playersWhoHaveBoughtThisRound).toHaveLength(2);
    });
  });

  describe('getNextPlayerForAuction', () => {
    it('returns first player when no one has bought', () => {
      const gameState = createMockGameState(3);
      const nextPlayer = getNextPlayerForAuction(gameState);

      expect(nextPlayer).toBe('player1');
    });

    it('skips player who already bought', () => {
      let gameState = createMockGameState(3);
      gameState = markPlayerAsBought(gameState, 'player1');

      const nextPlayer = getNextPlayerForAuction(gameState);

      expect(nextPlayer).toBe('player2');
    });

    it('returns null when all players have bought', () => {
      let gameState = createMockGameState(3);
      gameState = markPlayerAsBought(gameState, 'player1');
      gameState = markPlayerAsBought(gameState, 'player2');
      gameState = markPlayerAsBought(gameState, 'player3');

      const nextPlayer = getNextPlayerForAuction(gameState);

      expect(nextPlayer).toBeNull();
    });

    it('wraps around to check all players', () => {
      let gameState = createMockGameState(3);
      gameState.currentPlayerIndex = 2; // Start at player 3
      gameState = markPlayerAsBought(gameState, 'player3');
      gameState = markPlayerAsBought(gameState, 'player1');

      const nextPlayer = getNextPlayerForAuction(gameState);

      expect(nextPlayer).toBe('player2');
    });
  });

  describe('shouldAuctionPhaseEnd - First Round', () => {
    it('returns false when not all players have plants', () => {
      const gameState = createMockGameState(3);
      // Player 1 has a plant
      gameState.players[0].powerPlants = [mockPlant];

      const shouldEnd = shouldAuctionPhaseEnd(gameState);

      expect(shouldEnd).toBe(false);
    });

    it('returns true when all players have plants', () => {
      const gameState = createMockGameState(3);
      // All players have plants
      gameState.players[0].powerPlants = [mockPlant];
      gameState.players[1].powerPlants = [mockPlant];
      gameState.players[2].powerPlants = [mockPlant];

      const shouldEnd = shouldAuctionPhaseEnd(gameState);

      expect(shouldEnd).toBe(true);
    });
  });

  describe('shouldAuctionPhaseEnd - Later Rounds', () => {
    it('returns false when players still need to auction', () => {
      const gameState = createMockGameState(3);
      gameState.round = 2; // Not first round
      // All players already have plants from previous rounds
      gameState.players.forEach(p => p.powerPlants = [mockPlant]);

      // Only player 1 has bought this round
      gameState.playersWhoHaveBoughtThisRound = ['player1'];

      const shouldEnd = shouldAuctionPhaseEnd(gameState);

      expect(shouldEnd).toBe(false); // Players 2 and 3 haven't gone yet
    });

    it('returns true when all players have had their turn', () => {
      const gameState = createMockGameState(3);
      gameState.round = 2; // Not first round
      gameState.players.forEach(p => p.powerPlants = [mockPlant]);

      // All players have bought this round
      gameState.playersWhoHaveBoughtThisRound = ['player1', 'player2', 'player3'];

      const shouldEnd = shouldAuctionPhaseEnd(gameState);

      expect(shouldEnd).toBe(true);
    });

    it('handles player who passes (does not buy)', () => {
      const gameState = createMockGameState(3);
      gameState.round = 2;
      gameState.players.forEach(p => p.powerPlants = [mockPlant]);

      // Player 1 and 2 bought, player 3 hasn't gone yet
      gameState.playersWhoHaveBoughtThisRound = ['player1', 'player2'];

      const shouldEnd = shouldAuctionPhaseEnd(gameState);

      expect(shouldEnd).toBe(false); // Player 3 still needs their turn
    });
  });

  describe('Multi-player auction scenario', () => {
    it('handles complete auction round for 3 players', () => {
      let gameState = createMockGameState(3);

      // Player 1's turn
      expect(getNextPlayerForAuction(gameState)).toBe('player1');
      gameState = markPlayerAsBought(gameState, 'player1');
      gameState.players[0].powerPlants = [mockPlant];
      gameState.currentPlayerIndex = 1;

      // Should not end yet
      expect(shouldAuctionPhaseEnd(gameState)).toBe(false);

      // Player 2's turn
      expect(getNextPlayerForAuction(gameState)).toBe('player2');
      gameState = markPlayerAsBought(gameState, 'player2');
      gameState.players[1].powerPlants = [mockPlant];
      gameState.currentPlayerIndex = 2;

      // Should not end yet
      expect(shouldAuctionPhaseEnd(gameState)).toBe(false);

      // Player 3's turn
      expect(getNextPlayerForAuction(gameState)).toBe('player3');
      gameState = markPlayerAsBought(gameState, 'player3');
      gameState.players[2].powerPlants = [mockPlant];

      // Now should end
      expect(shouldAuctionPhaseEnd(gameState)).toBe(true);
      expect(getNextPlayerForAuction(gameState)).toBeNull();
    });

    it('handles 5 player game where last player already has plant', () => {
      let gameState = createMockGameState(5);
      gameState.round = 2; // Not first round

      // All players already have plants from round 1
      gameState.players.forEach(p => p.powerPlants = [mockPlant]);

      // 4 players buy, player 5 has option to pass
      gameState = markPlayerAsBought(gameState, 'player1');
      gameState = markPlayerAsBought(gameState, 'player2');
      gameState = markPlayerAsBought(gameState, 'player3');
      gameState = markPlayerAsBought(gameState, 'player4');

      // Player 5 hasn't bought yet
      expect(getNextPlayerForAuction(gameState)).toBe('player5');
      expect(shouldAuctionPhaseEnd(gameState)).toBe(false);

      // Player 5 passes (doesn't buy)
      // Phase should still allow them to pass

      // After player 5's turn (whether they bought or passed), phase ends
      gameState = markPlayerAsBought(gameState, 'player5');
      expect(shouldAuctionPhaseEnd(gameState)).toBe(true);
    });
  });
});
