import { useState } from 'react';
import './SetupScreen.css';

interface SetupScreenProps {
  onStartGame: (playerNames: string[]) => void;
}

function SetupScreen({ onStartGame }: SetupScreenProps) {
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2']);

  const handleNumPlayersChange = (num: number) => {
    setNumPlayers(num);
    const newNames = Array.from({ length: num }, (_, i) => playerNames[i] || `Player ${i + 1}`);
    setPlayerNames(newNames);
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    if (playerNames.every((name) => name.trim())) {
      onStartGame(playerNames);
    } else {
      alert('Please enter names for all players');
    }
  };

  return (
    <div className="setup-screen">
      <div className="setup-container">
        <h1>Power Grid</h1>
        <p className="subtitle">The Electrical Company Game</p>

        <div className="setup-section">
          <h2>Number of Players</h2>
          <div className="player-count-buttons">
            {[2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                className={`player-count-btn ${numPlayers === num ? 'active' : ''}`}
                onClick={() => handleNumPlayersChange(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-section">
          <h2>Player Names</h2>
          <div className="player-names">
            {playerNames.map((name, index) => (
              <div key={index} className="player-name-input">
                <label>Player {index + 1}:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  placeholder={`Player ${index + 1}`}
                  maxLength={20}
                />
              </div>
            ))}
          </div>
        </div>

        <button className="start-button" onClick={handleStart}>
          Start Game
        </button>

        <div className="game-info">
          <h3>About Power Grid</h3>
          <p>
            Power Grid is a strategic board game where players compete to supply electricity to cities.
            Purchase power plants, buy resources, expand your network, and power cities to earn money.
          </p>
          <p>The first player to power 17+ cities triggers the end, and whoever powers the most wins!</p>
        </div>
      </div>
    </div>
  );
}

export default SetupScreen;
