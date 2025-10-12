import { ResourceMarket as ResourceMarketType } from '../types/game';
import './ResourceMarket.css';

interface ResourceMarketProps {
  market: ResourceMarketType;
}

function ResourceMarket({ market }: ResourceMarketProps) {
  const resources = [
    { type: 'coal', label: 'Coal', icon: '⚫', color: '#2c3e50' },
    { type: 'oil', label: 'Oil', icon: '🛢️', color: '#34495e' },
    { type: 'garbage', label: 'Garbage', icon: '🗑️', color: '#7f8c8d' },
    { type: 'uranium', label: 'Uranium', icon: '☢️', color: '#27ae60' },
  ] as const;

  const getAvailableCount = (resourceType: keyof ResourceMarketType) => {
    return market[resourceType].length;
  };

  const getCurrentPrice = (resourceType: keyof ResourceMarketType) => {
    const available = market[resourceType];
    if (available.length === 0) return '-';
    return `$${available[available.length - 1]}`;
  };

  return (
    <div className="resource-market">
      <h2>Resource Market</h2>

      <div className="resources-list">
        {resources.map((resource) => (
          <div key={resource.type} className="resource-row">
            <div className="resource-header">
              <span className="resource-icon-large" style={{ color: resource.color }}>
                {resource.icon}
              </span>
              <span className="resource-label">{resource.label}</span>
            </div>
            <div className="resource-info">
              <div className="resource-stat">
                <span className="label">Available:</span>
                <span className="value">{getAvailableCount(resource.type)}</span>
              </div>
              <div className="resource-stat">
                <span className="label">Price:</span>
                <span className="value">{getCurrentPrice(resource.type)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResourceMarket;
