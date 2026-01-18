import React, { useState, useEffect } from 'react'

function TeamDivider({ 
  players, 
  selectedPlayers, 
  onClose, 
  onSelectAll, 
  onClearSelection, 
  onToggleSelection,
  onLogMatch,
  getCurrentMonthGoals
}) {
  const [teamA, setTeamA] = useState([])
  const [teamB, setTeamB] = useState([])

  const selectedPlayersList = players.filter(p => selectedPlayers.has(p.id))

  const divideTeams = () => {
    if (selectedPlayersList.length === 0) {
      alert('Please select at least one player')
      return
    }

    // Sort by total goals (descending)
    const sorted = [...selectedPlayersList].sort((a, b) => {
      const aGoals = getCurrentMonthGoals(a) + a.totalGoals
      const bGoals = getCurrentMonthGoals(b) + b.totalGoals
      return bGoals - aGoals
    })

    // Alternate assignment for balanced teams
    const newTeamA = []
    const newTeamB = []
    
    sorted.forEach((player, index) => {
      if (index % 2 === 0) {
        newTeamA.push(player)
      } else {
        newTeamB.push(player)
      }
    })

    setTeamA(newTeamA)
    setTeamB(newTeamB)
  }

  const shuffleTeams = () => {
    if (selectedPlayersList.length === 0) {
      alert('Please select at least one player')
      return
    }

    const shuffled = [...selectedPlayersList].sort(() => Math.random() - 0.5)
    const mid = Math.ceil(shuffled.length / 2)
    setTeamA(shuffled.slice(0, mid))
    setTeamB(shuffled.slice(mid))
  }

  const calculateTeamStats = (team) => {
    const totalGoals = team.reduce((sum, p) => sum + p.totalGoals, 0)
    const avgGoals = team.length > 0 ? (totalGoals / team.length).toFixed(1) : 0
    return { totalGoals, avgGoals, playerCount: team.length }
  }

  const teamAStats = calculateTeamStats(teamA)
  const teamBStats = calculateTeamStats(teamB)

  const handleLogMatch = () => {
    if (teamA.length === 0 || teamB.length === 0) {
      alert('Please divide teams first')
      return
    }
    onLogMatch(teamA.map(p => p.id), teamB.map(p => p.id))
    alert('Match logged successfully!')
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content team-divider-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👥 Divide Teams</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="team-divider-controls">
          <div className="selection-controls">
            <button className="btn btn-secondary" onClick={onSelectAll}>
              Select All
            </button>
            <button className="btn btn-secondary" onClick={onClearSelection}>
              Clear Selection
            </button>
            <span className="selection-count">
              {selectedPlayersList.length} player{selectedPlayersList.length !== 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="player-selection-list">
            {players.map(player => (
              <div 
                key={player.id}
                className={`player-selection-item ${selectedPlayers.has(player.id) ? 'selected' : ''}`}
                onClick={() => onToggleSelection(player.id)}
              >
                <input 
                  type="checkbox"
                  checked={selectedPlayers.has(player.id)}
                  onChange={() => {}}
                />
                <span>{player.name}</span>
                <span className="player-goals-preview">
                  {getCurrentMonthGoals(player)} monthly / {player.totalGoals} total
                </span>
              </div>
            ))}
          </div>

          <div className="team-division-actions">
            <button className="btn btn-primary" onClick={divideTeams}>
              ⚖️ Balance Teams
            </button>
            <button className="btn btn-secondary" onClick={shuffleTeams}>
              🎲 Random Shuffle
            </button>
          </div>
        </div>

        {(teamA.length > 0 || teamB.length > 0) && (
          <div className="teams-display">
            <div className="team team-a">
              <h3>Team A (Blue)</h3>
              <div className="team-stats">
                <div>Players: {teamAStats.playerCount}</div>
                <div>Total Goals: {teamAStats.totalGoals}</div>
                <div>Avg Goals: {teamAStats.avgGoals}</div>
              </div>
              <div className="team-players">
                {teamA.map(player => (
                  <div key={player.id} className="team-player">
                    {player.name} ({getCurrentMonthGoals(player)}/{player.totalGoals})
                  </div>
                ))}
              </div>
            </div>

            <div className="team team-b">
              <h3>Team B (Red)</h3>
              <div className="team-stats">
                <div>Players: {teamBStats.playerCount}</div>
                <div>Total Goals: {teamBStats.totalGoals}</div>
                <div>Avg Goals: {teamBStats.avgGoals}</div>
              </div>
              <div className="team-players">
                {teamB.map(player => (
                  <div key={player.id} className="team-player">
                    {player.name} ({getCurrentMonthGoals(player)}/{player.totalGoals})
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {teamA.length > 0 && teamB.length > 0 && (
          <div className="log-match-section">
            <button className="btn btn-success" onClick={handleLogMatch}>
              🏟️ Log Match
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamDivider
