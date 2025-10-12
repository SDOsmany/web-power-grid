# Power Grid - Complete Game Rules Reference

This document contains all the rules of Power Grid for implementation reference.

---

## Table of Contents
1. [Game Overview](#game-overview)
2. [Game Setup](#game-setup)
3. [Game Components](#game-components)
4. [Game Phases](#game-phases)
5. [Detailed Phase Rules](#detailed-phase-rules)
6. [Special Rules](#special-rules)
7. [End Game & Winning](#end-game--winning)
8. [Implementation Checklist](#implementation-checklist)

---

## Game Overview

**Players**: 2-6 players
**Goal**: Supply power to the most cities when the game ends
**Duration**: 90-120 minutes

### Core Concept
Players are power company managers who:
1. Buy power plants at auction
2. Purchase resources (coal, oil, garbage, uranium)
3. Expand their network by connecting cities
4. Power cities to earn money
5. Use that money to grow their network and buy better plants

---

## Game Setup

### Initial Setup

#### 1. Player Setup
- Each player receives **50 Elektro** (money)
- Each player chooses a color
- Randomly determine initial player order

#### 2. Power Plant Market Setup
- Remove certain power plants based on player count:
  - **2 players**: Remove plant #42 and 7 lowest plants (keep 3-10 initially)
  - **3 players**: Remove 8 lowest plants
  - **4 players**: Remove 4 lowest plants
  - **5-6 players**: Remove no plants
- Shuffle remaining plants
- Place **Step 3 card** at the bottom of the deck
- Draw 8 plants:
  - 4 lowest go to "Current Market" (available for purchase)
  - 4 next lowest go to "Future Market" (not available yet)

#### 3. Resource Market Setup
- Fill resource market with initial resources:
  - **Coal**: Fill all 24 spaces (costs: 1-8 Elektro)
  - **Oil**: Fill all 24 spaces (costs: 1-8 Elektro)
  - **Garbage**: Fill all 24 spaces (costs: 1-8 Elektro)
  - **Uranium**: Fill all 12 spaces (costs: 1-16 Elektro)

#### 4. Map Setup
- Use the USA map (or chosen region)
- No cities are initially connected

#### 5. Game Step
- Start at **Step 1**

---

## Game Components

### Power Plants
- **Number**: Determines auction order and value
- **Resource Type**: Coal, Oil, Garbage, Uranium, Hybrid (coal/oil), or Eco (free)
- **Resource Cost**: How many resources needed to power the plant
- **Cities Powered**: How many cities the plant can power

**Examples**:
- Plant #3: Uses 2 oil, powers 1 city
- Plant #13: Eco plant, uses 0 resources, powers 1 city
- Plant #23: Uses 1 uranium, powers 3 cities

### Resources
- **Coal**: Black cubes (⚫)
- **Oil**: Black barrels (🛢️)
- **Garbage**: Yellow/brown cubes (🗑️)
- **Uranium**: Red rods (☢️)

### Cities
- Connected by routes with different costs (in Elektro)
- Players pay connection costs to link cities to their network
- In Steps 2 & 3, multiple players can occupy the same city

### Money (Elektro)
- Currency for buying plants, resources, and building network
- Earned by powering cities in Bureaucracy phase

---

## Game Phases

Each round consists of 5 phases (in order):

1. **Determine Player Order**
2. **Auction Power Plants**
3. **Buy Resources**
4. **Build Network** (Building)
5. **Bureaucracy** (Power Cities & Earn Money)

After Bureaucracy, start a new round with Phase 1.

---

## Detailed Phase Rules

### Phase 1: Determine Player Order

**Goal**: Establish turn order for this round

**Rules**:
1. Sort players by:
   - **Primary**: Number of cities connected (most to least)
   - **Tiebreaker**: Highest numbered power plant
2. This order applies to Auction phase
3. **Reverse order** applies to Resource Buying and Building phases

**Implementation**:
```
Sort players:
  - Descending by cities.length
  - Descending by max(powerPlants.number)
```

**First Round Exception**: Random/chosen order

---

### Phase 2: Auction Power Plants

**Goal**: Players bid on and purchase power plants

#### Turn Order
- Follow player order from Phase 1
- Once you pass, you're out for the entire phase

#### Auction Process

**Step 1: Select a Plant**
- Current player chooses a plant from the **Current Market**
- Must start auction at plant's minimum bid (the plant number)
- OR pass (if you already have 3 plants)

**Step 2: Bidding**
- Proceed clockwise from the player who selected
- Players can bid or pass
- Each bid must be at least 1 Elektro higher
- Once you pass on an auction, you're out of that auction
- Last bidder wins

**Step 3: Purchase**
- Winner pays the bid amount
- Winner takes the plant
- Winner is done for this phase (cannot bid on more plants)

**Step 4: Market Refresh**
- Remove the purchased plant
- Draw a new plant from the deck
- Sort markets: 4 lowest in Current, 4 next in Future
- If Step 3 card is drawn, trigger Step 3 (see Special Rules)

**Repeat** until all players either:
- Own a new plant, OR
- Have passed

#### Plant Capacity Rules
- **Maximum plants**: 3 per player
- If you buy a 4th plant, immediately discard one (cannot be the one you just bought)
- Discarded plants go under the draw deck

#### First Round Special Rule
- Each player **must** buy exactly 1 plant
- Cannot pass until you own a plant
- Auction continues until everyone has 1 plant

---

### Phase 3: Buy Resources

**Goal**: Purchase resources from the market to fuel your plants

#### Turn Order
- **Reverse** player order (last place goes first)

#### Buying Process
1. On your turn, buy as many resources as you want (one at a time)
2. Pay the cost shown on the market
3. Resources become more expensive as supply decreases
4. You can only store resources on your power plants:
   - **Maximum per plant**: 2x the plant's resource cost
   - **Example**: Plant uses 2 coal → can store 4 coal max

#### Resource Costs
Resources are stored in the market from cheap (bottom) to expensive (top):
- Cheapest available resource costs 1 Elektro
- Most expensive uranium can cost 16 Elektro

#### Hybrid Plants
- Can use EITHER coal OR oil (but not both at once)
- Can store coal, oil, or mix up to the storage limit

#### Restrictions
- Cannot buy resources you can't store
- Must have enough money

---

### Phase 4: Build Network (Bureaucracy - Part 1)

**Goal**: Connect new cities to your network

#### Turn Order
- **Reverse** player order (last place goes first)

#### Building Process
1. On your turn, connect as many cities as you want
2. Pay connection costs for each city

#### Connection Rules

**Step 1**:
- Only ONE player can occupy each city
- If a city is occupied, you cannot connect to it
- Network must be contiguous (connected)

**Step 2** (triggered when someone connects to X cities):
- **2-6 players**: Step 2 starts when someone reaches 7 cities
- TWO players can occupy each city
- Each player still pays the full connection cost
- Both players must connect via different routes if possible

**Step 3** (triggered by Step 3 card):
- THREE players can occupy each city
- Each player still pays the full connection cost

#### Connection Costs
- Pay the cost on the route between cities
- If connecting to a city already in your network, pay the cheapest path
- You pay the full cost even if another player already built that route

#### First Connection
- Your first city can be any city (no connection cost)
- OR connect two cities simultaneously (pay the route cost)

#### Restrictions
- Must have enough money
- Cannot connect more cities than you can power
  - **Max cities** = Sum of all your plants' "cities powered"
  - **Example**: If you have plants that power 2, 3, and 4 cities, you can connect up to 9 cities

---

### Phase 5: Bureaucracy (Power Cities & Earn Money)

**Goal**: Use resources to power cities and earn income

#### Turn Order
- Simultaneous (all players at once, but can be done in any order for implementation)

#### Process

**Step 1: Choose Plants to Power**
- Select which plants to use
- Pay resources for each plant used
- Resources are returned to the supply (resource market)

**Step 2: Count Cities Powered**
- Add up the "cities powered" from all plants you used
- You earn money based on how many cities you power (not how many you own)

**Step 3: Earn Money**
| Cities Powered | Income (Elektro) |
|----------------|------------------|
| 0              | 10               |
| 1              | 10               |
| 2              | 11               |
| 3              | 13               |
| 4              | 15               |
| 5              | 18               |
| 6              | 21               |
| 7              | 24               |
| 8              | 27               |
| 9              | 30               |
| 10             | 33               |
| 11             | 36               |
| 12             | 39               |
| 13             | 42               |
| 14             | 45               |
| 15             | 48               |
| 16             | 51               |
| 17             | 54               |
| 18             | 57               |
| 19             | 60               |
| 20+            | 60               |

**Step 4: Refill Resource Market**
- Add resources based on current player count and game step
- See Resource Refill Table below

#### Resource Refill Table

Resources added at end of each round:

| Resource | Step 1 | Step 2 | Step 3 |
|----------|--------|--------|--------|
| Coal     | 3/4/5  | 4/5/6  | 3/4/5  |
| Oil      | 2/3/4  | 2/3/4  | 4/5/6  |
| Garbage  | 1/2/3  | 2/3/4  | 3/4/5  |
| Uranium  | 1/1/2  | 1/2/3  | 1/2/3  |

*Numbers represent resources added for 2-3 / 4 / 5-6 players*

Example: In Step 1 with 4 players, add 4 coal, 3 oil, 2 garbage, 1 uranium

---

## Special Rules

### Step Progression

The game progresses through 3 steps:

#### Step 1 → Step 2
- Triggered when any player connects to **7 cities** during Building phase
- Immediately:
  1. Remove the **lowest numbered plant** from Current Market
  2. Do NOT replace it (only 7 plants visible)
  3. Two players can now occupy each city

#### Step 2 → Step 3
- Triggered when the **Step 3 card** is drawn from the deck
- Immediately:
  1. Remove the **lowest numbered plant** from all visible plants
  2. Shuffle Step 3 card back into the deck (no longer special)
  3. Three players can now occupy each city
  4. Resource refill amounts change

### Power Plant Market Rules

**Sorting**: Always keep markets sorted by plant number
- Current Market: 4 lowest numbered plants
- Future Market: 4 next lowest

**Removing Plants**: When a plant is removed (Step change, discarded):
- Goes to the **bottom** of the draw deck
- OR removed from game entirely (implementation choice)

**Market Refresh**: After each plant auction:
1. Draw one plant from deck
2. Resort: 4 lowest to Current, 4 next to Future

### First Round Rules

1. **Auction Phase**: Everyone must buy exactly 1 plant
2. **Building Phase**: SKIP (no one builds)
3. **Bureaucracy Phase**: Still happens (but likely no one powers cities)

### Special Plant Types

**Eco Plants** (Green):
- No resources needed
- Always power for free
- Example: Plant #13 (powers 1), #44 (powers 5)

**Hybrid Plants** (Coal/Oil):
- Can use coal OR oil (not both)
- Example: Plant #12 (uses 2 hybrid, powers 2)

---

## End Game & Winning

### Game End Trigger

The game ends when:
1. Any player connects to **17+ cities** during Building phase, OR
2. There are not enough plants to refill the market after an auction

### Final Round

After the trigger:
- **Finish the current round completely**
- Do NOT start a new round

### Determining the Winner

Winner is the player who:
1. **Primary**: Powers the most cities in final Bureaucracy
2. **Tiebreaker 1**: Has the most money (Elektro)
3. **Tiebreaker 2**: Has the most cities connected

---

## Implementation Checklist

Use this checklist to track what's implemented:

### Setup Phase
- [ ] Initialize players with 50 Elektro
- [ ] Remove plants based on player count
- [ ] Set up power plant market (8 plants visible)
- [ ] Add Step 3 card to bottom of deck
- [ ] Initialize resource market (full)
- [ ] Set game to Step 1

### Phase 1: Determine Player Order
- [ ] Sort by cities connected (descending)
- [ ] Tiebreak by highest plant number
- [ ] Set turn order for Auction phase
- [ ] Set reverse order for other phases

### Phase 2: Auction
- [ ] Display Current Market plants
- [ ] Allow player to select plant to auction
- [ ] Implement bidding system
- [ ] Validate bids (minimum, can afford)
- [ ] Award plant to winner, deduct money
- [ ] Handle plant capacity (max 3, discard if 4th)
- [ ] Refresh market after each auction
- [ ] Handle Step 3 card draw
- [ ] Enforce "must buy" in first round

### Phase 3: Buy Resources
- [ ] Display resource market with prices
- [ ] Allow purchasing resources in reverse order
- [ ] Calculate dynamic resource prices
- [ ] Validate storage capacity (2x plant cost)
- [ ] Deduct money
- [ ] Update resource market after purchases

### Phase 4: Build Network
- [ ] Display interactive map
- [ ] Show which cities can be connected
- [ ] Calculate connection costs
- [ ] Enforce contiguity (connected network)
- [ ] Enforce Step-based occupancy limits
- [ ] Validate city connection limit (based on plant capacity)
- [ ] Deduct money for connections
- [ ] Trigger Step 1→2 when someone reaches 7 cities
- [ ] Update player networks

### Phase 5: Bureaucracy
- [ ] Allow selecting plants to power
- [ ] Validate resource availability
- [ ] Calculate cities powered
- [ ] Calculate income (lookup table)
- [ ] Return resources to market
- [ ] Pay players
- [ ] Refill resources (based on step and player count)

### Game Flow
- [ ] Progress through phases in order
- [ ] Start new round after Bureaucracy
- [ ] Handle Step 1→2 transition (7 cities)
- [ ] Handle Step 2→3 transition (Step 3 card)
- [ ] Detect end game trigger (17+ cities or no plants)
- [ ] Complete final round
- [ ] Calculate winner

### UI/UX
- [ ] Show current phase clearly
- [ ] Show current player's turn
- [ ] Display player stats (money, cities, resources)
- [ ] Show plant capacities and storage
- [ ] Visual feedback for valid/invalid actions
- [ ] Game rules help/modal
- [ ] Undo button (optional)

---

## Common Edge Cases

### Auction Phase
- **No one can afford any plants**: Skip phase
- **Last plant in market**: Still must maintain market rules
- **Player bankrupts themselves**: Not allowed - validate bids

### Resource Phase
- **Not enough resources available**: First come, first served
- **Buying with exactly 0 storage**: Not allowed
- **Uranium shortage**: Common strategy, intentional

### Building Phase
- **Cannot connect anywhere**: Skip turn
- **Disconnected network**: Not allowed - must be contiguous
- **Connecting to the same city twice**: Not allowed

### Bureaucracy Phase
- **Not enough resources to power any plants**: Earn money for 0 cities (10 Elektro)
- **More plants than resources**: Choose which plants to use
- **Powering fewer cities than connected**: Allowed (strategic choice)

---

## Reference Tables

### Income Table (Full)
```
0-1 cities:  10 Elektro
2 cities:    11 Elektro
3 cities:    13 Elektro
4 cities:    15 Elektro
5 cities:    18 Elektro
6 cities:    21 Elektro
7 cities:    24 Elektro
8 cities:    27 Elektro
9 cities:    30 Elektro
10 cities:   33 Elektro
11 cities:   36 Elektro
12 cities:   39 Elektro
13 cities:   42 Elektro
14 cities:   45 Elektro
15 cities:   48 Elektro
16 cities:   51 Elektro
17 cities:   54 Elektro
18 cities:   57 Elektro
19 cities:   60 Elektro
20+ cities:  60 Elektro
```

### Resource Market Costs
```
Bottom spaces (most supply): 1 Elektro each
...prices increase as supply decreases...
Top spaces (least supply): 8 Elektro (coal/oil/garbage), 16 Elektro (uranium)
```

### Plant Removal by Player Count
```
2 players: Remove plant 42, and plants 13-25 (keep 3-12, 26+)
3 players: Remove plants 13-24 (keep 3-12, 25+)
4 players: Remove plants 13-16 (keep 3-12, 17+)
5 players: Remove plant 13 only
6 players: Remove no plants
```

---

**Last Updated**: 2025-10-12
**Version**: 1.0 (Complete Rules)

---

## Notes for Developers

- When in doubt about a rule, refer to this document
- Mark checklist items as you implement them
- Add edge cases you discover during development
- This is the source of truth for game logic
