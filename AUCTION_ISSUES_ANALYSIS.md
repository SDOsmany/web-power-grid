# Auction System Issues Analysis

## Issues Identified

### Issue 1: First Player Cannot Bid Minimum (Plant Number)
**User Report:** "when i click on the power plant i want to bid on, i cant bid the same price that is going for it has to be one more"

**Current Behavior:**
- When a player selects a plant, the auction starts with `currentBid: plant.number`
- The bidding UI requires `bidAmount >= auction.currentBid + 1` (line 46, 252, 258 in AuctionModal.tsx)
- This forces the first bidder to bid HIGHER than the plant number

**Expected Behavior (Official Rules):**
According to OFFICIAL_RULES_CORRECTIONS.md (lines 135-138):
> **Last player advantage:**
> - If last player starts an auction and no one bids against them
> - They can buy the plant for MINIMUM BID (the plant number)
> - This is an advantage to being last

**Analysis:**
- The FIRST player who selects a plant should be able to buy it at minimum bid (plant number) if no one else bids
- Currently, when a player selects a plant, they are forced to bid ABOVE the plant number
- The auction should start with NO BIDDER, and the selecting player should be able to bid the minimum

**Official Rule (from rulebook):**
- When a player offers a plant for auction, they start the bidding
- The minimum bid is the plant number
- The player who offered it can bid the minimum, or someone else can
- If nobody bids against the offering player, they get it at minimum bid

---

### Issue 2: Cannot Cancel Plant Selection
**User Report:** "i dont want to bid on that one and i clicked on it by mistake, there is no way for me to back out from it"

**Current Behavior:**
- Once a player clicks a plant, the auction immediately starts
- No way to cancel or go back to plant selection
- Player is locked into that auction

**Expected Behavior:**
- Player should be able to cancel plant selection and choose a different plant
- OR player should be able to pass entirely if they don't want any plant

**Analysis:**
- Need a "Cancel" or "Choose Different Plant" button during auction
- This is especially important in first round where everyone must buy SOMETHING, but they might want to switch plants

---

### Issue 3: Pass Button Infinite Loop
**User Report:** "the second person that goes next the pass doesnt work and unless the next people pass then its an infinite loop of bidding where no player can purchase it"

**Current Behavior (AuctionModal.tsx):**
```typescript
const handlePass = () => {
  if (!auction) return;

  // In first round, cannot pass if you don't have a plant
  if (isFirstRoundGame && currentPlayer && currentPlayer.powerPlants.length === 0) {
    alert('You must buy a plant in the first round!');
    return;
  }

  const newAuction = passAuction(auction, currentTurnPlayerId);
  setAuction(newAuction);

  // Check if auction is complete
  if (isAuctionComplete(newAuction)) {
    completeAuction(newAuction);
  } else {
    // Move to next player
    const nextPlayerId = getNextAuctionPlayer(newAuction, currentTurnPlayerId, gameState.players);
    if (nextPlayerId) {
      setCurrentTurnPlayerId(nextPlayerId);
    }
  }
};
```

**Analysis:**
- `passAuction()` removes player from `activePlayers` array
- `isAuctionComplete()` checks if `activePlayers.length <= 1`
- `getNextAuctionPlayer()` gets next player from `activePlayers` array
- **PROBLEM:** If player passes, they're removed from active players, but then `getNextAuctionPlayer()` tries to find next player in active players array
- **EDGE CASE:** If the player who SELECTED the plant passes immediately, and there's only one other active player, the auction should complete, but the logic might not handle this correctly

**Potential Loop Scenario:**
1. Player A selects plant (auction starts, currentBid = plant number, currentBidder = null)
2. Player B is next, they pass → removed from activePlayers
3. Only Player A left in activePlayers
4. But Player A hasn't bid yet (currentBidder = null)
5. getAuctionWinner() returns null because currentBidder is null
6. Auction doesn't complete properly

---

### Issue 4: First Round Plant Purchase at Minimum
**User Report:** "i remember on the rules when the game starts the first player that gets to bid its supposed to get the first plant for 1 electrode right?"

**Research Needed:**
This is NOT in our official rules document. Need to verify:
- Does the VERY FIRST plant in the game (Round 1, first player) go for free or minimum bid?
- Or is this referring to the "last player advantage" rule where if nobody bids against you, you get it at minimum?

**From Official Rules (OFFICIAL_RULES_CORRECTIONS.md lines 154-160):**
```
### First Round Special Rules

**Confirmed:**
1. Everyone MUST buy a plant
2. Building phase is SKIPPED (no one builds)
3. Bureaucracy phase still happens
4. After auctions, re-determine player order by plant numbers only
```

No special pricing mentioned for first round. The "1 Elektro" might be confused with:
- Plant #3 (the lowest plant) having a minimum bid of 3 Elektro
- OR the last player advantage (buying at minimum if nobody bids against you)

---

## Root Cause Analysis

### Primary Issues:
1. **Auction initialization logic is wrong** - Should not set currentBid to plant.number immediately
2. **No mechanism to cancel plant selection** - UI/UX issue
3. **Auction completion logic has edge cases** - When player who selected plant is the only one left
4. **Minimum bid confusion** - Current bid starts at plant number, but first bidder must bid higher

### Correct Auction Flow (Official Rules):
1. Player selects a plant to offer for auction
2. Bidding starts at minimum (plant number)
3. **Player who offered it gets FIRST CHANCE to bid**
4. They can bid minimum, or someone else can outbid
5. Bidding continues clockwise until all but one player passes
6. If nobody bids, the player who offered it MUST take it at minimum (in first round)

---

## Proposed Fixes

### Fix 1: Allow Minimum Bid for First Bidder
**Change in startAuction() (auctionManager.ts):**
```typescript
export function startAuction(
  gameState: GameState,
  plant: PowerPlant,
  startingPlayerId: string
): AuctionState {
  return {
    plant,
    currentBid: plant.number, // This is the MINIMUM bid
    currentBidder: null, // No bidder yet
    startingPlayer: startingPlayerId, // Track who started the auction
    activePlayers: gameState.players.map(p => p.id),
    passedPlayers: [],
  };
}
```

**Change in AuctionModal.tsx:**
- Allow bidding AT current bid if currentBidder is null (first bid)
- After first bid, require bids to be currentBid + 1

```typescript
const handleBid = () => {
  if (!auction || !currentPlayer) return;

  const minimumBid = auction.currentBidder === null
    ? auction.currentBid  // First bid can match minimum
    : auction.currentBid + 1;  // Subsequent bids must be higher

  if (bidAmount < minimumBid) {
    alert('Bid must be at least ' + minimumBid);
    return;
  }

  // ... rest of logic
};
```

### Fix 2: Add Cancel/Back Button
**Add to AuctionModal.tsx in bidding phase:**
```typescript
const handleCancelAuction = () => {
  setAuction(null);
  setSelectedPlant(null);
  setBidAmount(0);
};

// In JSX:
<button className="cancel-btn" onClick={handleCancelAuction}>
  Choose Different Plant
</button>
```

### Fix 3: Fix Auction Completion Logic
**Update getAuctionWinner() in auctionManager.ts:**
```typescript
export function getAuctionWinner(auction: AuctionState): string | null {
  // If only one player left active
  if (auction.activePlayers.length === 1) {
    return auction.activePlayers[0];
  }

  // If all players passed and we have a current bidder
  if (auction.activePlayers.length === 0 && auction.currentBidder) {
    return auction.currentBidder;
  }

  // If nobody bid (everyone passed without bidding)
  if (auction.activePlayers.length === 0 && !auction.currentBidder) {
    // In first round, the player who started auction must take it
    return auction.startingPlayer || null;
  }

  return auction.currentBidder;
}
```

### Fix 4: Clarify First Round Rules
**No code changes needed** - The "1 Elektro" is a misunderstanding:
- Minimum bid = plant number
- If you're last to bid and nobody bids against you, you get it at minimum
- Plant #3 costs minimum 3 Elektro, Plant #4 costs minimum 4 Elektro, etc.

---

## Implementation Priority

1. **HIGH PRIORITY - Fix minimum bid logic** (Fix 1)
   - This breaks basic auction functionality
   - Players cannot bid fairly

2. **HIGH PRIORITY - Fix pass/completion logic** (Fix 3)
   - Causes infinite loops
   - Breaks game flow

3. **MEDIUM PRIORITY - Add cancel button** (Fix 2)
   - Quality of life improvement
   - Prevents user errors

4. **LOW PRIORITY - Document first round rules** (Fix 4)
   - Just clarification
   - No code changes needed

---

## Testing Checklist

After fixes, test these scenarios:
- [ ] First player selects plant, can bid at minimum (plant number)
- [ ] Second player can bid minimum + 1
- [ ] Player selects plant then cancels, can select different plant
- [ ] All players pass except one → auction completes correctly
- [ ] Player selects plant, everyone passes → player gets it at minimum
- [ ] First round: player must buy a plant (cannot pass selection)
- [ ] Later rounds: player can pass entire auction phase
