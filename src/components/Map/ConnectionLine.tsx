import type { City } from '../../types/game';
import './ConnectionLine.css';

interface ConnectionLineProps {
  from: City;
  to: City;
  cost: number;
  owners: string[]; // Player IDs who have built this connection
  getPlayerColor: (playerId: string) => string;
}

function ConnectionLine({ from, to, cost, owners, getPlayerColor }: ConnectionLineProps) {
  // Calculate line color based on ownership
  const getLineColor = () => {
    if (owners.length === 0) return '#ccc'; // No one built this yet
    if (owners.length === 1) return getPlayerColor(owners[0]);
    // Multiple owners - use dashed line with multiple colors (for now, just show first owner)
    return getPlayerColor(owners[0]);
  };

  const lineColor = getLineColor();
  const strokeWidth = owners.length > 0 ? 3 : 2;
  const strokeDasharray = owners.length > 1 ? '5,5' : 'none';

  // Calculate midpoint for cost label
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  return (
    <g className="connection-line">
      {/* Connection line */}
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        opacity={owners.length > 0 ? 0.8 : 0.3}
      />

      {/* Cost label background */}
      <circle
        cx={midX}
        cy={midY}
        r="10"
        fill="white"
        stroke="#999"
        strokeWidth="1"
        opacity="0.9"
      />

      {/* Cost label text */}
      <text
        x={midX}
        y={midY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="10"
        fill="#333"
        fontWeight="600"
        className="connection-cost"
      >
        {cost}
      </text>
    </g>
  );
}

export default ConnectionLine;
