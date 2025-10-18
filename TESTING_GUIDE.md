# Testing Guide for Power Grid

## Quick Start

```bash
# Run all tests once
npm run test:run

# Run tests in watch mode (auto-rerun on changes)
npm test

# Run tests with UI dashboard
npm run test:ui
```

## What We're Testing

We use **Vitest** (a fast, modern test framework) to test our game logic. This means we can verify auction rules, game mechanics, and business logic WITHOUT manually clicking through the UI every time.

## Current Test Coverage

### ✅ Auction System (`src/game/__tests__/auctionManager.test.ts`)

**12 Tests Covering:**

1. **Basic Flow (5 tests)**
   - Auction initialization with correct minimum bid
   - First bidder can bid at plant number (minimum)
   - Subsequent bids must be higher
   - Passing removes player from auction
   - Auction completes when one player left

2. **Winner Determination (3 tests)**
   - Last active player wins
   - Current bidder wins when they're last standing
   - Starting player wins if nobody bids

3. **Affordability (1 test)**
   - Correctly checks if player can afford bid

4. **Edge Cases (3 tests)**
   - Two-player auction works correctly
   - Six-player auction works correctly
   - Competitive bidding between multiple players

## How to Add New Tests

### Example: Testing Resource Purchase Logic

```typescript
import { describe, it, expect } from 'vitest';
import { purchaseResource, getResourceCost } from '../resourceManager';

describe('Resource Purchasing', () => {
  it('deducts correct amount when purchasing coal', () => {
    const initialMoney = 50;
    const gameState = createMockGameState();

    const newState = purchaseResource(gameState, 'player1', 'coal');

    expect(newState.players[0].money).toBeLessThan(initialMoney);
    expect(newState.players[0].resources.coal).toBe(1);
  });

  it('prevents purchase when no storage space', () => {
    const gameState = createMockGameStateWithFullStorage();

    const newState = purchaseResource(gameState, 'player1', 'coal');

    expect(newState).toBeNull(); // Purchase failed
  });
});
```

## Test Organization

```
src/
├── game/
│   ├── __tests__/
│   │   ├── auctionManager.test.ts     ✅ 12 tests
│   │   ├── resourceManager.test.ts    📝 TODO
│   │   ├── gameLogic.test.ts          📝 TODO
│   │   └── phaseManager.test.ts       📝 TODO
│   ├── auctionManager.ts
│   ├── resourceManager.ts
│   └── gameLogic.ts
```

## Benefits of Our Testing Approach

### ✅ **What We Have Now:**
1. **Fast** - 12 tests run in 8ms
2. **Reliable** - Tests pure functions (no UI flakiness)
3. **Easy to write** - Simple JavaScript, no complex setup
4. **Automated** - Run on every change
5. **Documentation** - Tests serve as examples of how functions work

### 📝 **What We Could Add (Optional):**

#### Option A: More Unit Tests
Test other game logic:
- Resource purchasing (refillResourceMarket, purchaseResource)
- Phase transitions (advancePhase, checkGameEnd)
- Player order (determinePlayerOrder)
- Network building (validateCityConnection)

#### Option B: Cucumber/BDD Tests
For complex scenarios in plain English:

```gherkin
Feature: First Round Auction
  Scenario: Everyone must buy a plant
    Given it's Round 1
    And Player A has no plants
    When Player A tries to pass at plant selection
    Then they should see error "Must buy in first round"

  Scenario: Players can pass during bidding
    Given it's Round 1
    And Player A selected Plant #3 and bid 3
    When it's Player B's turn
    Then Player B can pass the auction
```

**Verdict:** Unit tests are perfect for now. Cucumber would be cool to learn but might be overkill.

## When to Run Tests

### During Development:
```bash
npm test  # Watch mode - auto-runs when you save files
```

### Before Committing:
```bash
npm run test:run  # One-time run to verify everything passes
```

### Continuous Integration (Future):
We could set up GitHub Actions to run tests on every push/PR.

## Test-Driven Development (TDD) Example

Instead of manually testing, write tests FIRST:

```typescript
// 1. Write failing test
it('player cannot bid more than their money', () => {
  const player = { ...mockPlayer, money: 5 };
  const result = canAffordBid(player, 10);
  expect(result).toBe(false);
});

// 2. Run test - it fails ❌

// 3. Write code to make it pass
export function canAffordBid(player: Player, bidAmount: number): boolean {
  return player.money >= bidAmount;
}

// 4. Run test - it passes ✅

// 5. Commit with confidence!
```

## Debugging Tests

If a test fails:

1. **Read the error message** - Vitest shows exactly what failed
2. **Check the test file** - Look at the specific test case
3. **Run just that test:**
   ```bash
   npm test -- -t "allows first bidder to bid at minimum"
   ```
4. **Add console.logs** in the test to debug
5. **Fix the bug** in the source code
6. **Verify test passes**

## Summary

- ✅ **12 auction tests** all passing
- ⚡ **Fast feedback** (tests run in milliseconds)
- 🛡️ **Safety net** (catch bugs before manual testing)
- 📚 **Living documentation** (tests show how code should work)
- 🚀 **Confidence** (refactor without fear of breaking things)

No more manually testing every scenario! The tests do it for us. 🎉
