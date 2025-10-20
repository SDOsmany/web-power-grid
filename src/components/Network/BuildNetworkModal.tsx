import { useState } from 'react';
import type { GameState, City } from '../../types/game';
import {
  getBuildableCities,
  calculateBuildCost,
  buildInCity,
  shouldSkipBuildingPhase,
} from '../../game/networkManager';
import './BuildNetworkModal.css';

interface BuildNetworkModalProps {
  gameState: GameState;
  onBuild: (newGameState: GameState) => void;
  onPass: () => void;
  onClose: () => void;
}

function BuildNetworkModal({ gameState, onBuild, onPass, onClose }: BuildNetworkModalProps) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const buildableCities = getBuildableCities(gameState, currentPlayer.id);

  // Check if building phase should be skipped (first round)
  if (shouldSkipBuildingPhase(gameState)) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content build-network-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Building Phase</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <div className="first-round-message">
              <h3>First Round - Building Skipped</h3>
              <p>In the first round, no building takes place.</p>
              <p>The game will proceed to the Bureaucracy phase.</p>
            </div>
          </div>
          <div className="modal-footer">
            <button className="primary-button" onClick={onClose}>
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCityClick = (city: City) => {
    setSelectedCity(city);
  };

  const handleBuild = () => {
    if (!selectedCity) return;

    const newGameState = buildInCity(gameState, currentPlayer.id, selectedCity.id);
    if (newGameState) {
      onBuild(newGameState);
      setSelectedCity(null);
    }
  };

  const selectedCityCost = selectedCity
    ? calculateBuildCost(gameState, currentPlayer.id, selectedCity.id)
    : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content build-network-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Build Network</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="player-info">
            <h3 style={{ color: currentPlayer.color }}>{currentPlayer.name}'s Turn</h3>
            <p className="player-money">Money: {currentPlayer.money} Elektro</p>
            <p className="player-cities">Cities: {currentPlayer.cities.length}</p>
          </div>

          <div className="building-info">
            <h4>Building Costs:</h4>
            <div className="cost-info">
              <span>First house in city: 10 Elektro + connection</span>
              {gameState.step >= 2 && <span>Second house in city: 15 Elektro + connection</span>}
              {gameState.step >= 3 && <span>Third house in city: 20 Elektro + connection</span>}
            </div>
            {currentPlayer.cities.length === 0 && (
              <p className="first-city-note">Your first city has no connection cost!</p>
            )}
          </div>

          <div className="city-selection">
            <h4>Select a city to build in:</h4>
            <div className="cities-list">
              {buildableCities.length === 0 ? (
                <p className="no-cities">No cities available to build in</p>
              ) : (
                buildableCities.map(city => {
                  const cost = calculateBuildCost(gameState, currentPlayer.id, city.id);
                  const canAfford = cost && currentPlayer.money >= cost.totalCost;

                  return (
                    <div
                      key={city.id}
                      className={`city-card ${selectedCity?.id === city.id ? 'selected' : ''} ${
                        !canAfford ? 'cannot-afford' : ''
                      }`}
                      onClick={() => handleCityClick(city)}
                    >
                      <div className="city-name">{city.name}</div>
                      <div className="city-region">Region: {city.region}</div>
                      {cost && (
                        <div className="city-cost">
                          <div>House: {cost.houseCost} Elektro</div>
                          <div>Connection: {cost.connectionCost} Elektro</div>
                          <div className="total-cost">Total: {cost.totalCost} Elektro</div>
                        </div>
                      )}
                      {!canAfford && <div className="cannot-afford-label">Cannot Afford</div>}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {selectedCity && selectedCityCost && (
            <div className="selected-city-summary">
              <h4>Building in {selectedCity.name}:</h4>
              <p>House Cost: {selectedCityCost.houseCost} Elektro</p>
              <p>Connection Cost: {selectedCityCost.connectionCost} Elektro</p>
              <p className="total">Total: {selectedCityCost.totalCost} Elektro</p>
              <p>Remaining: {currentPlayer.money - selectedCityCost.totalCost} Elektro</p>
            </div>
          )}

          <div className="current-network">
            <h4>Your Network:</h4>
            {currentPlayer.cities.length === 0 ? (
              <p>No cities yet</p>
            ) : (
              <div className="network-cities">
                {currentPlayer.cities.map(city => (
                  <span key={city.id} className="network-city">
                    {city.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="build-button"
            onClick={handleBuild}
            disabled={!selectedCity || !selectedCityCost || currentPlayer.money < selectedCityCost.totalCost}
          >
            Build {selectedCity ? `in ${selectedCity.name}` : ''}
          </button>
          <button className="pass-button" onClick={onPass}>
            Pass (Don't Build)
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuildNetworkModal;
