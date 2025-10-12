# Official Rules Corrections & Additions

This document contains corrections and additions based on the official Power Grid rulebook.

## Critical Corrections

### Initial Resource Market Setup (CORRECTED)

The initial setup is **different** from our implementation:

**Official Initial Setup:**
- 3 coal on spaces 1-8 (24 total)
- 3 oil on spaces 3-8 (18 total)
- 3 garbage on spaces 7-8 (6 total)
- 1 uranium on spaces 14 and 16 (2 total)

**Prices at start:**
- Cheapest coal: 1 Elektro
- Cheapest oil: 3 Elektro
- Cheapest garbage: 7 Elektro
- Cheapest uranium: 14 Elektro

**Resource Storage Rules:**
- Coal/Oil/Garbage: Max 3 per space on spaces 1-8
- Coal/Oil/Garbage: NEVER placed on spaces 10-16
- Uranium: Max 1 per space on spaces 1-16

### Plant Removal by Player Count (CORRECTED)

**Official removal rules:**

| Players | Regions | Plants Removed | Max Plants/Player | Step 2 Trigger | Game End |
|---------|---------|----------------|-------------------|----------------|----------|
| 2       | 3       | 8 (random, face-down) | 4 | 10 cities | 21 cities |
| 3       | 3       | 8 (random, face-down) | 3 | 7 cities | 17 cities |
| 4       | 4       | 4 (random, face-down) | 3 | 7 cities | 17 cities |
| 5       | 5       | 0 (none)       | 3 | 7 cities | 15 cities |
| 6       | 5       | 0 (none)       | 3 | 6 cities | 14 cities |

**Important:**
- Remove plant #13 (eco) from deck, place face-down on TOP of stack
- Remove specified number randomly, place face-down
- Set up market with plants 3-10
- Place Step 3 card at BOTTOM of deck

### Building Costs (VERIFIED CORRECT)

- **First house in city**: 10 Elektro + connection costs
- **Second house in city** (Step 2): 15 Elektro + connection costs
- **Third house in city** (Step 3): 20 Elektro + connection costs
- **First city ever**: Just 10 Elektro (no connection costs)

### Resource Refill Table (OFFICIAL)

**Step 1:**
| Players | Coal | Oil | Garbage | Uranium |
|---------|------|-----|---------|---------|
| 2       | 3    | 2   | 1       | 1       |
| 3       | 4    | 2   | 1       | 1       |
| 4       | 5    | 3   | 2       | 1       |
| 5       | 5    | 4   | 3       | 2       |
| 6       | 7    | 5   | 3       | 2       |

**Step 2:**
| Players | Coal | Oil | Garbage | Uranium |
|---------|------|-----|---------|---------|
| 2       | 4    | 2   | 2       | 1       |
| 3       | 5    | 3   | 2       | 2       |
| 4       | 6    | 4   | 3       | 2       |
| 5       | 7    | 5   | 4       | 3       |
| 6       | 9    | 6   | 5       | 3       |

**Step 3:**
| Players | Coal | Oil | Garbage | Uranium |
|---------|------|-----|---------|---------|
| 2       | 3    | 4   | 3       | 1       |
| 3       | 4    | 5   | 3       | 2       |
| 4       | 5    | 6   | 4       | 2       |
| 5       | 6    | 7   | 5       | 3       |
| 6       | 7    | 9   | 6       | 4       |

### Step 2 Transition (CLARIFIED)

**When triggered:**
- Any player builds their 7th city (varies by player count)
- Happens BEFORE Phase 5 (Bureaucracy)
- Can happen with multiple players in same round

**What happens:**
1. Remove LOWEST numbered plant from market ONCE
2. Draw replacement from deck
3. Rearrange market (4 current, 4 future)
4. From now on: 2 houses per city allowed
5. Building cost for 2nd house: 15 Elektro

### Step 3 Transition (CLARIFIED)

**Three ways it can happen:**

**1. Drawn in Phase 2 (Auction):**
- Treat Step 3 card as highest plant in Future Market
- Shuffle remaining plants from bottom of deck back in
- Continue auctions until phase ends
- After Phase 2: Remove lowest plant AND Step 3 card
- Do NOT draw replacements
- Step 3 starts in Phase 3

**2. Drawn in Phase 4 (Building) as replacement:**
- Remove Step 3 card and smallest plant
- Do NOT draw replacements
- Shuffle remaining plants back in
- Step 3 starts in Phase 5

**3. Drawn in Phase 5 (Bureaucracy):**
- Remove Step 3 card and lowest plant
- Do NOT draw replacements
- Shuffle remaining plants back in
- Use Step 2 resource refill ONE more time
- Step 3 starts in Phase 1 of next round

**Step 3 Changes:**
- Only 6 plants in market (ALL in actual market, no future market)
- 3 houses per city allowed
- Building cost for 3rd house: 20 Elektro
- Each Phase 5: Remove smallest plant, draw replacement

### Auction Phase Details (ADDITIONAL RULES)

**When no plant is sold in a round:**
- Remove lowest numbered plant from market
- Draw replacement from deck
- Rearrange market
- Continue to next phase

**Last player advantage:**
- If last player starts an auction and no one bids against them
- They can buy the plant for MINIMUM BID (the plant number)
- This is an advantage to being last

**When auctioning player wins:**
- Next player in turn order offers next plant
- If they already bought, skip to next

**When other player wins:**
- Auctioning player can choose new plant or pass

**Plant too low rule:**
- If ANY plant in actual market has number ≤ any player's city count
- Immediately remove it from game
- Draw replacement
- Check again (multiple removals possible)
- Does NOT affect plants owned by players

### First Round Special Rules

**Confirmed:**
1. Everyone MUST buy a plant
2. Building phase is SKIPPED (no one builds)
3. Bureaucracy phase still happens
4. After auctions, re-determine player order by plant numbers only

### Hybrid Plants (CLARIFIED)

**Rules:**
- Can use coal AND/OR oil in any combination
- Example: Plant 05 needs 2 resources
  - Can use: 2 coal, 2 oil, or 1 coal + 1 oil
- Storage: Can store coal and oil up to limit
  - Example: Plant 05 stores up to 4 total (any mix)

### Game End (OFFICIAL)

**Triggers:**
- Game ends IMMEDIATELY after Phase 4 (Building)
- When at least one player has the required cities (varies by player count)
- OR when there are not enough plants to refill market

**No more phases:**
- No Phase 5 (Bureaucracy) in final round
- Players use what they have

**Winner:**
1. Player who can power MOST cities with current resources/plants
2. Tiebreaker 1: Most money
3. Tiebreaker 2: Most cities connected

**Important Note:**
- Winner is often NOT the player with most cities
- Must be able to actually POWER the cities
- Balance plants, resources, and cities

## Implementation Priority

### HIGH PRIORITY (Must Fix):
1. ✅ Initial resource market setup
2. ✅ Plant removal by player count (including 2-player rules)
3. ✅ Resource refill tables (exact numbers)
4. ✅ Step 2/3 trigger conditions by player count
5. ✅ Building costs (10/15/20 verified)

### MEDIUM PRIORITY (Should Fix):
6. Plant removal when equal to city count
7. Step 3 card handling (3 different scenarios)
8. Last player minimum bid rule
9. No plant sold in round rule
10. Game end triggers (no Phase 5)

### LOW PRIORITY (Nice to Have):
11. First round special order re-determination
12. Hybrid plant storage clarification
13. Resource market placement rules (never on 10-16)
14. Uranium refill from space 16 downward

## Notes

- Our current implementation is close but has some discrepancies
- Most critical: Initial resource setup and refill tables
- Game end logic needs to be updated (no final bureaucracy)
- Player count variations are important for balance

**Status:** Document created for reference during implementation
