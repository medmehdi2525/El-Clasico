import React from 'react'

function PlayerDetailsModal({ player, onClose, monthlyGoals, allTimeGoals, matchesPlayed, matches }) {
  // Calculate statistics
  const avgGoalsPerMatch = matchesPlayed > 0 ? (allTimeGoals / matchesPlayed).toFixed(2) : 0
  const avgMonthlyGoals = monthlyGoals > 0 ? (monthlyGoals / 1).toFixed(1) : 0
  
  // Get match history for this player
  const playerMatches = matches.filter(m => 
    m.teamA.includes(player.id) || m.teamB.includes(player.id)
  ).sort((a, b) => new Date(b.date) - new Date(a.date))

  // Calculate consecutive matches scoring
  // Check if player's team scored in recent matches
  let consecutiveScoring = 0
  let isOnFire = false
  for (let i = 0; i < playerMatches.length; i++) {
    const match = playerMatches[i]
    if (match.teamAGoals === undefined || match.teamBGoals === undefined) break
    
    const wasInTeamA = match.teamA.includes(player.id)
    const teamGoals = wasInTeamA ? (match.teamAGoals || 0) : (match.teamBGoals || 0)
    
    // If team scored, count as scoring match (simplified - ideally track individual goals)
    if (teamGoals > 0) {
      consecutiveScoring++
      isOnFire = true
    } else {
      break
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content player-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Player Details</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="player-details-content">
          <div className="player-details-header">
            <h3>{player.name}</h3>
            {isOnFire && (
              <span className="on-fire-badge">🔥 On Fire ({consecutiveScoring} matches)</span>
            )}
          </div>

          <div className="player-stats-grid">
            <div className="stat-box">
              <div className="stat-box-label">Total Goals</div>
              <div className="stat-box-value">{allTimeGoals}</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">Monthly Goals</div>
              <div className="stat-box-value">{monthlyGoals}</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">Matches Played</div>
              <div className="stat-box-value">{matchesPlayed}</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">Avg Goals/Match</div>
              <div className="stat-box-value">{avgGoalsPerMatch}</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">Current Streak</div>
              <div className="stat-box-value">{player.currentStreak} days</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">Assists</div>
              <div className="stat-box-value">{player.assists || 0}</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">MVPs</div>
              <div className="stat-box-value">{player.mvps || 0}</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">Player Type</div>
              <div className="stat-box-value">{player.isPermanent ? 'Permanent' : 'Temporary'}</div>
            </div>
          </div>

          <div className="match-history-section">
            <h4>Recent Matches</h4>
            {playerMatches.length === 0 ? (
              <p className="no-matches">No matches played yet</p>
            ) : (
              <div className="matches-list-detailed">
                {playerMatches.slice(0, 10).map(match => {
                  const wasInTeamA = match.teamA.includes(player.id)
                  const teamGoals = wasInTeamA ? (match.teamAGoals || 0) : (match.teamBGoals || 0)
                  const opponentGoals = wasInTeamA ? (match.teamBGoals || 0) : (match.teamAGoals || 0)
                  
                  return (
                    <div key={match.id} className="match-item-detailed">
                      <div className="match-date-detailed">
                        {new Date(match.date).toLocaleDateString()}
                      </div>
                      <div className="match-score-detailed">
                        {wasInTeamA ? 'Team A' : 'Team B'} {teamGoals} - {opponentGoals} {wasInTeamA ? 'Team B' : 'Team A'}
                      </div>
                      <div className={`match-result ${teamGoals > opponentGoals ? 'win' : teamGoals < opponentGoals ? 'loss' : 'draw'}`}>
                        {teamGoals > opponentGoals ? 'W' : teamGoals < opponentGoals ? 'L' : 'D'}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerDetailsModal
