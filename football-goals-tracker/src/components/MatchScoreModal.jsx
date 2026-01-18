import React, { useState, useEffect } from 'react'

function MatchScoreModal({ match, players, onClose, onSave, isAdmin }) {
  const [teamAGoals, setTeamAGoals] = useState(match.teamAGoals || 0)
  const [teamBGoals, setTeamBGoals] = useState(match.teamBGoals || 0)

  const handleSave = () => {
    if (!isAdmin) return
    onSave({
      ...match,
      teamAGoals: parseInt(teamAGoals) || 0,
      teamBGoals: parseInt(teamBGoals) || 0
    })
    onClose()
  }

  const getPlayerNames = (playerIds) => {
    return playerIds.map(id => {
      const player = players.find(p => p.id === id)
      return player ? player.name : 'Unknown'
    }).join(', ')
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content match-score-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Match Score</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="match-score-content">
          <div className="match-date-display">
            {new Date(match.date).toLocaleDateString()}
          </div>

          <div className="teams-score-display">
            <div className="team-score-section">
              <h4>Team A</h4>
              <div className="team-players-list">{getPlayerNames(match.teamA)}</div>
              {isAdmin ? (
                <input
                  type="number"
                  min="0"
                  value={teamAGoals}
                  onChange={(e) => setTeamAGoals(e.target.value)}
                  className="score-input"
                  placeholder="0"
                />
              ) : (
                <div className="score-display">{teamAGoals}</div>
              )}
            </div>

            <div className="score-separator">-</div>

            <div className="team-score-section">
              <h4>Team B</h4>
              <div className="team-players-list">{getPlayerNames(match.teamB)}</div>
              {isAdmin ? (
                <input
                  type="number"
                  min="0"
                  value={teamBGoals}
                  onChange={(e) => setTeamBGoals(e.target.value)}
                  className="score-input"
                  placeholder="0"
                />
              ) : (
                <div className="score-display">{teamBGoals}</div>
              )}
            </div>
          </div>

          {isAdmin && (
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleSave}>
                Save Score
              </button>
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MatchScoreModal
