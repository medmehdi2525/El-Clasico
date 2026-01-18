import React, { useState } from 'react'

function CustomTeam({ players, getCurrentMonthGoals, customTeams, setCustomTeams }) {
  const [teamName, setTeamName] = useState('')
  const [selectedPlayers, setSelectedPlayers] = useState(new Set())

  const togglePlayerSelection = (id) => {
    setSelectedPlayers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const createCustomTeam = () => {
    if (!teamName.trim() || selectedPlayers.size === 0) {
      alert('Please enter a team name and select at least one player')
      return
    }

    const teamPlayers = players.filter(p => selectedPlayers.has(p.id))
    const newTeam = {
      id: Date.now().toString(),
      name: teamName.trim(),
      players: teamPlayers.map(p => p.id),
      createdAt: new Date().toISOString()
    }

    setCustomTeams([...customTeams, newTeam])
    setTeamName('')
    setSelectedPlayers(new Set())
  }

  const deleteCustomTeam = (id) => {
    if (window.confirm('Delete this custom team?')) {
      setCustomTeams(customTeams.filter(t => t.id !== id))
    }
  }

  const getTeamStats = (team) => {
    const teamPlayers = players.filter(p => team.players.includes(p.id))
    const totalGoals = teamPlayers.reduce((sum, p) => sum + getCurrentMonthGoals(p), 0)
    const totalAllTime = teamPlayers.reduce((sum, p) => sum + p.totalGoals, 0)
    return { totalGoals, totalAllTime, playerCount: teamPlayers.length }
  }

  return (
    <div className="custom-team-section">
      <h3>Custom Teams</h3>
      
      <div className="create-team-form">
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name..."
          className="team-name-input"
        />
        <button onClick={createCustomTeam} className="btn-create-team">
          Create Team
        </button>
      </div>

      <div className="player-selection-grid">
        {players.map(player => (
          <div
            key={player.id}
            className={`player-select-item ${selectedPlayers.has(player.id) ? 'selected' : ''}`}
            onClick={() => togglePlayerSelection(player.id)}
          >
            <input
              type="checkbox"
              checked={selectedPlayers.has(player.id)}
              onChange={() => {}}
            />
            <span className="player-select-name">{player.name}</span>
            <span className="player-select-goals">
              {getCurrentMonthGoals(player)}/{player.totalGoals}
            </span>
          </div>
        ))}
      </div>

      {customTeams.length > 0 && (
        <div className="custom-teams-list">
          {customTeams.map(team => {
            const stats = getTeamStats(team)
            return (
              <div key={team.id} className="custom-team-card">
                <div className="custom-team-header">
                  <h4>{team.name}</h4>
                  <button
                    className="btn-delete-team"
                    onClick={() => deleteCustomTeam(team.id)}
                  >
                    🗑️
                  </button>
                </div>
                <div className="custom-team-stats">
                  <div className="team-stat-item">
                    <span>Players: {stats.playerCount}</span>
                  </div>
                  <div className="team-stat-item">
                    <span>Monthly Goals: {stats.totalGoals}</span>
                  </div>
                  <div className="team-stat-item">
                    <span>All-Time Goals: {stats.totalAllTime}</span>
                  </div>
                </div>
                <div className="custom-team-players">
                  {players
                    .filter(p => team.players.includes(p.id))
                    .map(player => (
                      <div key={player.id} className="custom-team-player">
                        {player.name} ({getCurrentMonthGoals(player)})
                      </div>
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CustomTeam
