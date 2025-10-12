# Development Notes

This document contains important information for developers working on this project.

## Common Issues and Solutions

### TypeScript Import Error: "does not provide an export"

**Issue**: When running the dev server, you may see errors like:
```
Uncaught SyntaxError: The requested module '/src/types/game.ts' does not provide an export named 'PowerPlant'
```

**Root Cause**: This project uses `verbatimModuleSyntax` in the TypeScript configuration, which requires type-only imports to use the `import type` syntax.

**Solution**: Always use `import type` when importing types/interfaces:

```typescript
// ❌ Wrong
import { PowerPlant, GameState } from '../types/game';

// ✅ Correct
import type { PowerPlant, GameState } from '../types/game';
```

**Why this matters**: With `verbatimModuleSyntax` enabled, TypeScript preserves the exact import/export syntax in the compiled output. Type-only imports are completely removed during compilation, while value imports are preserved. Mixing them up causes module resolution errors.

## Development Workflow

### Starting the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Building for Production

```bash
npm run build
```

### Type Checking

```bash
npx tsc --noEmit
```

### Clearing Vite Cache

If you encounter strange module errors, try clearing the Vite cache:

```bash
rm -rf node_modules/.vite
npm run dev
```

## Project Structure

```
src/
├── components/        # React components
│   ├── SetupScreen.tsx       # Game setup and player configuration
│   ├── GameBoard.tsx         # Main game board container
│   ├── PlayerPanel.tsx       # Individual player status display
│   ├── PowerPlantMarket.tsx  # Power plant market display
│   ├── ResourceMarket.tsx    # Resource market display
│   └── GamePhaseDisplay.tsx  # Current game phase indicator
├── game/             # Game logic and data
│   ├── gameLogic.ts          # Core game state management
│   ├── powerPlants.ts        # Power plant definitions
│   └── map.ts                # City map and connections
├── types/            # TypeScript type definitions
│   └── game.ts               # All game-related types
└── App.tsx           # Main application component
```

## Code Style Guidelines

1. **Type Imports**: Always use `import type` for types and interfaces
2. **Component Files**: Use `.tsx` extension for components, `.ts` for logic
3. **CSS**: Co-locate CSS files with components (e.g., `Component.tsx` + `Component.css`)
4. **Naming**: Use PascalCase for components, camelCase for functions/variables

## Git Workflow

1. Make changes and test locally
2. Commit with descriptive messages
3. Push to remote
4. Create pull requests for significant features

## Future Development

See the roadmap in README.md for planned features and phases.
