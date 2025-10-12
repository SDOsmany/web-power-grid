# Power Grid - Web Edition

A web-based recreation of the popular board game **Power Grid** built with React, TypeScript, and Vite.

## About Power Grid

Power Grid is a strategic board game where players compete to supply electricity to cities. Players purchase power plants, buy resources, expand their network, and power cities to earn money. The first player to power 17+ cities triggers the end game, and whoever powers the most cities wins!

## Current Features

- **Game Setup**: Configure 2-6 players with custom names
- **Beautiful UI**: Modern, responsive interface with gradient backgrounds
- **Power Plant Market**: Visual display of available power plants (current and future market)
- **Resource Market**: Track availability and pricing of coal, oil, garbage, and uranium
- **Player Panels**: Track each player's money, cities, power plants, and resources
- **Game Phases**: Support for all game phases including:
  - Determine Player Order
  - Auction Power Plants
  - Buy Resources
  - Build Network
  - Bureaucracy (Power Cities)

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with custom styles
- **Game Logic**: Pure TypeScript

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (recommended)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/        # React components
│   ├── SetupScreen.tsx
│   ├── GameBoard.tsx
│   ├── PlayerPanel.tsx
│   ├── PowerPlantMarket.tsx
│   ├── ResourceMarket.tsx
│   └── GamePhaseDisplay.tsx
├── game/             # Game logic
│   ├── gameLogic.ts
│   ├── powerPlants.ts
│   └── map.ts
├── types/            # TypeScript type definitions
│   └── game.ts
└── App.tsx           # Main application component
```

## Roadmap

### Phase 1: Core Game Mechanics (In Progress)
- [x] Game setup and initialization
- [x] Power plant market display
- [x] Resource market display
- [x] Player panels
- [ ] Power plant auction system
- [ ] Resource purchasing
- [ ] City network building
- [ ] Bureaucracy phase (powering cities)

### Phase 2: Multiplayer
- [ ] WebSocket integration (Socket.io)
- [ ] Real-time multiplayer support
- [ ] Room/lobby system
- [ ] Player authentication

### Phase 3: Persistence
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Save/load games
- [ ] Game history

### Phase 4: Advanced Features
- [ ] In-game chat system
- [ ] SMS notifications (Twilio)
- [ ] Mobile-responsive design improvements
- [ ] Sound effects and animations
- [ ] AI opponents
- [ ] Different maps (Germany, France, etc.)

## Game Rules Reference

Power Grid follows these main phases each round:

1. **Determine Player Order**: Players are ordered by number of cities connected (descending), then by highest plant number
2. **Auction Power Plants**: Players bid on power plants from the current market
3. **Buy Resources**: Players purchase coal, oil, garbage, or uranium to fuel their plants
4. **Build Network**: Players pay to connect cities to their network
5. **Bureaucracy**: Players spend resources to power cities and earn money

The game progresses through 3 steps, with the Step 3 card triggering the end game.

## Contributing

This is a personal project for playing Power Grid with friends. Feel free to fork and modify for your own use!

## License

This is a fan-made recreation for personal use. Power Grid is a trademark of Friedemann Friese and Rio Grande Games.

## Acknowledgments

- Original game design by Friedemann Friese
- Published by Rio Grande Games
