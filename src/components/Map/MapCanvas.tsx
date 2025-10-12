import type { City, GameState } from '../../types/game';
import CityNode from './CityNode';
import ConnectionLine from './ConnectionLine';
import './MapCanvas.css';

interface MapCanvasProps {
  gameState: GameState;
}

function MapCanvas({ gameState }: MapCanvasProps) {
  const { cities, players } = gameState;

  // Helper to check if a city is owned by any player
  const getCityOwners = (cityId: string): string[] => {
    return players.filter((player) => player.cities.includes(cityId)).map((p) => p.id);
  };

  // Helper to get player color by ID
  const getPlayerColor = (playerId: string): string => {
    const player = players.find((p) => p.id === playerId);
    return player?.color || '#999';
  };

  // Create a map of cities by ID for quick lookup
  const cityMap = new Map(cities.map((city) => [city.id, city]));

  // Build list of all unique connections (avoid duplicates)
  const connections = new Set<string>();
  const connectionData: Array<{
    from: City;
    to: City;
    cost: number;
    owners: string[];
  }> = [];

  cities.forEach((city) => {
    city.connections.forEach((conn) => {
      const connectionKey = [city.id, conn.cityId].sort().join('-');
      if (!connections.has(connectionKey)) {
        connections.add(connectionKey);
        const toCity = cityMap.get(conn.cityId);
        if (toCity) {
          // Find which players have built this connection
          const owners: string[] = [];
          players.forEach((player) => {
            if (player.cities.includes(city.id) && player.cities.includes(conn.cityId)) {
              owners.push(player.id);
            }
          });

          connectionData.push({
            from: city,
            to: toCity,
            cost: conn.cost,
            owners,
          });
        }
      }
    });
  });

  return (
    <div className="map-canvas-container">
      <svg
        className="map-canvas"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background */}
        <rect width="1000" height="600" fill="#f5f5f5" />

        {/* Connection lines layer */}
        <g className="connections-layer">
          {connectionData.map((conn, index) => (
            <ConnectionLine
              key={index}
              from={conn.from}
              to={conn.to}
              cost={conn.cost}
              owners={conn.owners}
              getPlayerColor={getPlayerColor}
            />
          ))}
        </g>

        {/* City nodes layer */}
        <g className="cities-layer">
          {cities.map((city) => {
            const owners = getCityOwners(city.id);
            return (
              <CityNode
                key={city.id}
                city={city}
                owners={owners}
                getPlayerColor={getPlayerColor}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export default MapCanvas;
