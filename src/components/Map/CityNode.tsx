import React from 'react';
import type { City } from '../../types/game';
import './CityNode.css';

interface CityNodeProps {
  city: City;
  owners: string[]; // Player IDs who own this city
  getPlayerColor: (playerId: string) => string;
}

function CityNode({ city, owners, getPlayerColor }: CityNodeProps) {
  const radius = 12;

  // Determine fill color based on ownership
  const getFillColor = () => {
    if (owners.length === 0) return '#fff'; // Unoccupied
    if (owners.length === 1) return getPlayerColor(owners[0]);
    // Multiple owners - show split colors
    return 'url(#multi-owner-' + city.id + ')';
  };

  const needsGradient = owners.length > 1;

  return (
    <g className="city-node">
      {/* Define gradient for multiple owners */}
      {needsGradient && (
        <defs>
          <linearGradient id={'multi-owner-' + city.id} x1="0%" y1="0%" x2="100%" y2="100%">
            {owners.map((ownerId, index) => {
              const offset = (index / owners.length) * 100;
              const nextOffset = ((index + 1) / owners.length) * 100;
              return (
                <React.Fragment key={ownerId}>
                  <stop offset={`${offset}%`} stopColor={getPlayerColor(ownerId)} />
                  <stop offset={`${nextOffset}%`} stopColor={getPlayerColor(ownerId)} />
                </React.Fragment>
              );
            })}
          </linearGradient>
        </defs>
      )}

      {/* City circle */}
      <circle
        cx={city.x}
        cy={city.y}
        r={radius}
        fill={getFillColor()}
        stroke="#333"
        strokeWidth="2"
        className="city-circle"
      />

      {/* City name (on hover) */}
      <title>{city.name}</title>

      {/* City name label */}
      <text
        x={city.x}
        y={city.y - radius - 5}
        textAnchor="middle"
        className="city-label"
        fontSize="11"
        fill="#333"
        fontWeight="600"
      >
        {city.name}
      </text>
    </g>
  );
}

export default CityNode;
