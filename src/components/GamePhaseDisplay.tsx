import type { GamePhase } from '../types/game';
import './GamePhaseDisplay.css';

interface GamePhaseDisplayProps {
  phase: GamePhase;
}

const PHASE_NAMES: Record<GamePhase, string> = {
  setup: 'Game Setup',
  'determine-player-order': 'Determine Player Order',
  'auction-power-plants': 'Auction Power Plants',
  'buy-resources': 'Buy Resources',
  'build-network': 'Build Network',
  bureaucracy: 'Bureaucracy (Power Cities)',
  'game-over': 'Game Over',
};

const PHASE_DESCRIPTIONS: Record<GamePhase, string> = {
  setup: 'Setting up the game...',
  'determine-player-order': 'Players are ordered by cities connected and highest plant',
  'auction-power-plants': 'Players bid on power plants from the market',
  'buy-resources': 'Players purchase resources to fuel their power plants',
  'build-network': 'Players connect cities to expand their network',
  bureaucracy: 'Players power cities and earn money',
  'game-over': 'The game has ended!',
};

function GamePhaseDisplay({ phase }: GamePhaseDisplayProps) {
  return (
    <div className="phase-display">
      <div className="phase-name">{PHASE_NAMES[phase]}</div>
      <div className="phase-description">{PHASE_DESCRIPTIONS[phase]}</div>
    </div>
  );
}

export default GamePhaseDisplay;
