import type { PowerPlant } from '../types/game';
import './PowerPlantMarket.css';

interface PowerPlantMarketProps {
  market: {
    current: PowerPlant[];
    future: PowerPlant[];
    deck: PowerPlant[];
  };
}

function PowerPlantMarket({ market }: PowerPlantMarketProps) {
  const getResourceColor = (type: string) => {
    switch (type) {
      case 'coal':
        return '#2c3e50';
      case 'oil':
        return '#34495e';
      case 'garbage':
        return '#7f8c8d';
      case 'uranium':
        return '#27ae60';
      case 'hybrid':
        return '#e67e22';
      case 'eco':
        return '#16a085';
      default:
        return '#95a5a6';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'coal':
        return '⚫';
      case 'oil':
        return '🛢️';
      case 'garbage':
        return '🗑️';
      case 'uranium':
        return '☢️';
      case 'hybrid':
        return '⚡';
      case 'eco':
        return '🌱';
      default:
        return '❓';
    }
  };

  const renderPlant = (plant: PowerPlant) => (
    <div key={plant.number} className="power-plant-card">
      <div className="plant-number" style={{ backgroundColor: getResourceColor(plant.resourceType) }}>
        {plant.number}
      </div>
      <div className="plant-info">
        <div className="plant-resource">
          <span className="resource-icon-large">{getResourceIcon(plant.resourceType)}</span>
          <span className="resource-type">{plant.resourceType}</span>
        </div>
        <div className="plant-stats">
          <div className="stat-item">
            <span className="stat-label">Cost:</span>
            <span className="stat-value">{plant.resourceCost}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Powers:</span>
            <span className="stat-value">{plant.citiesPowered} 🏙️</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="power-plant-market">
      <h2>Power Plant Market</h2>

      <div className="market-section">
        <h3>Current Market</h3>
        <div className="plants-grid">
          {market.current.map((plant) => renderPlant(plant))}
        </div>
      </div>

      <div className="market-section">
        <h3>Future Market</h3>
        <div className="plants-grid">
          {market.future.map((plant) => renderPlant(plant))}
        </div>
      </div>

      <div className="deck-info">
        <span>Cards in deck: {market.deck.length}</span>
      </div>
    </div>
  );
}

export default PowerPlantMarket;
