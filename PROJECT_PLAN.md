# Power Grid - Web Edition - Project Plan

## Project Overview

A fully-featured web implementation of the board game Power Grid, with multiplayer support, game persistence, and real-time communication features.

---

## Current Status (Phase 0 - COMPLETED ✅)

### What We Have:
- ✅ React + TypeScript + Vite setup
- ✅ Core type definitions (GameState, Player, PowerPlant, etc.)
- ✅ All 40+ power plants data
- ✅ USA map with 35 cities and connections (data only, no visualization)
- ✅ Resource market initialization
- ✅ Game initialization logic
- ✅ Beautiful UI components:
  - Setup screen
  - Game board layout
  - Player panels
  - Power plant market display
  - Resource market display
  - Game phase indicator

### What We're Missing:
- ❌ Map visualization (cities positioned on screen)
- ❌ Auction mechanics
- ❌ Resource purchasing logic
- ❌ Network building (city connections)
- ❌ Bureaucracy phase (powering cities)
- ❌ Turn management and phase transitions
- ❌ Win condition checking
- ❌ Multiplayer (backend, WebSockets)
- ❌ Database persistence
- ❌ Chat system
- ❌ SMS notifications

---

## Architecture Plan

### Map Visualization Architecture

**Problem**: Our map data has city connections but no visual coordinates.

**Solution**: SVG-based interactive map

#### Map Data Structure (Enhanced)
```typescript
interface City {
  id: string;
  name: string;
  region: string;
  x: number;          // NEW: X coordinate (0-1000 range)
  y: number;          // NEW: Y coordinate (0-600 range)
  connections: Connection[];
}

interface CityConnection {
  from: string;       // City ID
  to: string;         // City ID
  cost: number;
  ownedBy: string[];  // Player IDs who have built this connection
}
```

#### Map Component Architecture
```
<MapComponent>
  - SVG canvas (viewBox for scaling)
  - Background (optional USA map image)
  - Connection lines layer
    - Each connection as a line
    - Color-coded by which players own it
  - City nodes layer
    - Circles for each city
    - Color-coded by which player(s) connected
    - Hover tooltips with city name
  - Interactive layer
    - Click handlers for building connections
    - Highlight available cities during build phase
</MapComponent>
```

#### Component Breakdown:
1. **MapCanvas.tsx** - Main SVG container
2. **CityNode.tsx** - Individual city circle
3. **ConnectionLine.tsx** - Line between cities
4. **MapControls.tsx** - Zoom/pan controls (Phase 2)

---

## Implementation Phases

### Phase 1: Core Gameplay (Local/Hot-seat) - 4-6 weeks

**Goal**: Make the game fully playable for multiple players on one device

#### 1.1 Map Visualization (Week 1)
- [ ] Add X/Y coordinates to all 35 cities in map.ts
- [ ] Create MapCanvas component (SVG-based)
- [ ] Create CityNode component
- [ ] Create ConnectionLine component
- [ ] Render all cities and connections
- [ ] Add hover effects and tooltips
- [ ] Test responsiveness on different screen sizes

**Deliverable**: Visual map showing all cities and potential connections

#### 1.2 Turn Management & Phase System (Week 1-2)
- [ ] Implement phase transition logic
- [ ] Create phase-specific UI controls
- [ ] Add "Next Phase" button functionality
- [ ] Implement player order determination
- [ ] Add turn indicator UI
- [ ] Handle phase-specific player actions

**Deliverable**: Players can progress through game phases

#### 1.3 Power Plant Auction System (Week 2-3)
- [ ] Create AuctionModal component
- [ ] Implement bidding logic
- [ ] Add "Pass" functionality
- [ ] Handle auction winner
- [ ] Update power plant market after auction
- [ ] Implement market refresh rules
- [ ] Add "must buy" rule for first round

**Deliverable**: Players can bid on and purchase power plants

#### 1.4 Resource Market & Purchasing (Week 3)
- [ ] Make resource market interactive
- [ ] Implement resource purchase logic
- [ ] Add resource cost calculation (market pricing)
- [ ] Update market after purchases
- [ ] Validate purchases (money, plant capacity)
- [ ] Implement resource refill logic

**Deliverable**: Players can buy resources from the market

#### 1.5 Network Building (Week 4)
- [ ] Make map interactive during build phase
- [ ] Highlight cities player can connect to
- [ ] Calculate connection costs
- [ ] Handle overlapping connections (Step 2/3)
- [ ] Validate network connectivity rules
- [ ] Update player cities and money
- [ ] Visual feedback for player networks

**Deliverable**: Players can build their city networks

#### 1.6 Bureaucracy Phase (Week 4-5)
- [ ] Create PowerCitiesModal component
- [ ] Allow players to select plants to use
- [ ] Validate resource availability
- [ ] Calculate income based on cities powered
- [ ] Deduct resources used
- [ ] Update player money
- [ ] Show income summary

**Deliverable**: Players can power cities and earn money

#### 1.7 Game Flow & Win Condition (Week 5)
- [ ] Implement Step progression (1 → 2 → 3)
- [ ] Handle Step 3 card trigger
- [ ] Implement end game detection
- [ ] Calculate winner
- [ ] Create game over screen
- [ ] Add "New Game" functionality

**Deliverable**: Complete game from start to finish

#### 1.8 Polish & Bug Fixes (Week 6)
- [ ] Add animations and transitions
- [ ] Improve error messages
- [ ] Add game rules help modal
- [ ] Test all edge cases
- [ ] Fix any bugs
- [ ] Improve mobile responsiveness

**Deliverable**: Polished, bug-free local gameplay

---

### Phase 2: Multiplayer Foundation (3-4 weeks)

**Goal**: Enable real-time online multiplayer

#### 2.1 Backend Setup (Week 7)
- [ ] Set up Node.js + Express server
- [ ] Set up Socket.io for real-time communication
- [ ] Create room/lobby system
- [ ] Implement player authentication (simple)
- [ ] Create game session management

**Tech Stack**:
- Backend: Node.js + Express
- Real-time: Socket.io
- Deployment: Railway or Render

#### 2.2 Real-time Game State Sync (Week 8)
- [ ] Move game state to server
- [ ] Implement state synchronization
- [ ] Handle player actions via WebSocket
- [ ] Add reconnection handling
- [ ] Implement turn validation on server

#### 2.3 Lobby System (Week 8-9)
- [ ] Create lobby UI
- [ ] Room creation and joining
- [ ] Player ready status
- [ ] Game start coordination
- [ ] Invite links

#### 2.4 Multiplayer Testing & Polish (Week 10)
- [ ] Test with multiple clients
- [ ] Handle disconnections gracefully
- [ ] Add spectator mode (optional)
- [ ] Performance optimization

**Deliverable**: Fully functional online multiplayer

---

### Phase 3: Persistence & Data (2-3 weeks)

**Goal**: Save games and user data

#### 3.1 Database Setup (Week 11)
- [ ] Choose database (PostgreSQL recommended)
- [ ] Design database schema
- [ ] Set up database connection
- [ ] Create models/repositories

**Database Schema**:
```
Users
- id, username, email, password_hash, created_at

Games
- id, created_at, updated_at, status, current_phase, round, step

GamePlayers
- id, game_id, user_id, player_order, money, color, cities, resources

GameState
- id, game_id, state_json (full game state)
```

#### 3.2 Save/Load Functionality (Week 12)
- [ ] Implement save game
- [ ] Implement load game
- [ ] Auto-save after each turn
- [ ] Game history/replay

#### 3.3 User Accounts (Week 12-13)
- [ ] User registration
- [ ] Login/logout
- [ ] User profiles
- [ ] Game statistics

**Deliverable**: Games persist across sessions

---

### Phase 4: Advanced Features (3-4 weeks)

**Goal**: Add chat, notifications, and quality-of-life features

#### 4.1 In-Game Chat (Week 14)
- [ ] Create chat component
- [ ] Implement chat via WebSocket
- [ ] Chat history
- [ ] Player mentions
- [ ] Emoji support

#### 4.2 SMS Notifications (Week 15)
- [ ] Integrate Twilio
- [ ] Phone number verification
- [ ] Send "your turn" notifications
- [ ] Send "game started" notifications
- [ ] Opt-in/opt-out functionality

#### 4.3 Enhanced UI/UX (Week 16)
- [ ] Sound effects
- [ ] Animations for actions
- [ ] Improved mobile experience
- [ ] Dark/light theme
- [ ] Accessibility improvements

#### 4.4 Additional Features (Week 17)
- [ ] AI opponent (basic)
- [ ] Game replay/history viewer
- [ ] Statistics and leaderboards
- [ ] Different maps (Germany, France)

**Deliverable**: Feature-complete, polished game

---

## Technical Decisions

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules (current) or migrate to Tailwind CSS (optional)
- **State Management**: React Context API (current) → Consider Zustand for complex state
- **Map Rendering**: SVG (Phase 1) → Canvas if performance issues

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Real-time**: Socket.io
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **API**: REST for initial requests, WebSocket for game actions

### Deployment
- **Frontend**: Vercel or Netlify
- **Backend**: Railway or Render
- **Database**: Supabase (PostgreSQL) or Railway
- **File Storage**: S3 or Cloudinary (if needed for images)

### Development Workflow
- **Version Control**: Git + GitHub
- **Branching**: Feature branches → PR → main
- **CI/CD**: GitHub Actions for testing and deployment
- **Testing**: Vitest for unit tests, Playwright for E2E (later)

---

## File Structure Plan

```
web-power-grid/
├── client/                    # Frontend (current src/)
│   ├── src/
│   │   ├── components/
│   │   │   ├── game/
│   │   │   │   ├── Map/
│   │   │   │   │   ├── MapCanvas.tsx
│   │   │   │   │   ├── CityNode.tsx
│   │   │   │   │   ├── ConnectionLine.tsx
│   │   │   │   │   └── MapControls.tsx
│   │   │   │   ├── Auction/
│   │   │   │   │   ├── AuctionModal.tsx
│   │   │   │   │   └── BiddingPanel.tsx
│   │   │   │   ├── Resources/
│   │   │   │   │   └── ResourcePurchase.tsx
│   │   │   │   └── Bureaucracy/
│   │   │   │       └── PowerCitiesModal.tsx
│   │   │   ├── lobby/
│   │   │   │   ├── LobbyList.tsx
│   │   │   │   └── GameRoom.tsx
│   │   │   ├── chat/
│   │   │   │   └── ChatPanel.tsx
│   │   │   └── ui/           # Existing components
│   │   ├── game/             # Game logic
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API and WebSocket services
│   │   ├── types/
│   │   └── utils/
│   └── package.json
│
├── server/                    # Backend (to be created)
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── socket/
│   │   ├── models/
│   │   └── server.ts
│   └── package.json
│
├── shared/                    # Shared types (optional)
│   └── types/
│
├── docs/                      # Documentation
│   ├── API.md
│   ├── GAME_RULES.md
│   └── ARCHITECTURE.md
│
├── PROJECT_PLAN.md           # This file
├── DEVELOPMENT.md            # Dev guidelines
└── README.md                 # User-facing docs
```

---

## Risk Assessment

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Map visualization performance with many connections | Medium | Use Canvas instead of SVG if needed |
| WebSocket connection stability | High | Implement robust reconnection logic |
| Game state sync issues in multiplayer | High | Thorough testing, server as source of truth |
| Database scaling | Low | Use connection pooling, optimize queries |

### Scope Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Feature creep | Medium | Stick to phase plan, defer nice-to-haves |
| Complexity of Power Grid rules | High | Implement incrementally, test thoroughly |
| Multiplayer testing difficulty | Medium | Recruit beta testers early |

---

## Success Metrics

### Phase 1 (Local Game)
- [ ] Complete game playable from start to finish
- [ ] All Power Grid rules correctly implemented
- [ ] Zero game-breaking bugs
- [ ] Responsive design works on desktop and tablet

### Phase 2 (Multiplayer)
- [ ] 4 players can complete a full game online
- [ ] < 100ms latency for game actions
- [ ] Graceful handling of disconnections
- [ ] Lobby system supports multiple concurrent games

### Phase 3 (Persistence)
- [ ] Games can be saved and resumed
- [ ] User authentication works reliably
- [ ] Database queries < 100ms average

### Phase 4 (Advanced Features)
- [ ] Chat messages delivered in < 50ms
- [ ] SMS notifications sent within 5 seconds
- [ ] 90+ Lighthouse accessibility score

---

## Next Steps (Immediate)

1. ✅ Create this plan document
2. **Add coordinates to map data** (map.ts)
3. **Create MapCanvas component** (basic SVG rendering)
4. **Test map rendering** with all cities visible
5. **Plan auction system** (modal, bidding logic)

---

## Design Decisions (RESOLVED ✅)

1. **Map Design**: ✅ Abstract/clean (no realistic USA map background)
2. **Mobile**: ✅ No mobile support - tablet/desktop only
3. **Timeline**: ✅ 4-6 weeks for Phase 1 is acceptable
4. **AI**: Do we want AI opponents in Phase 1 or Phase 4? (TBD)
5. **Authentication**: Simple username/password or OAuth (Google, GitHub)? (TBD)
6. **Monetization**: Keep it free or consider premium features later? (TBD)

---

## Notes

- This is a living document - update as plans change
- Reference this before starting any major feature
- Create GitHub issues based on this plan
- Update status as phases complete

---

**Last Updated**: 2025-10-12
**Current Phase**: Phase 0 Complete, Planning Phase 1
