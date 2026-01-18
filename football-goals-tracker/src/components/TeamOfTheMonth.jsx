import React from 'react'

function TeamOfTheMonth({ matches, players }) {
  // Calculate team performance from matches
  const calculateTeamStats = () => {
    const teamStats = {}
    
    matches.forEach(match => {
      if (!match.teamAGoals && !match.teamBGoals) return // Skip matches without scores
      
      const teamAKey = match.teamA.sort().join(',')
      const teamBKey = match.teamB.sort().join(',')
      
      if (!teamStats[teamAKey]) {
        teamStats[teamAKey] = {
          players: match.teamA,
          goals: 0,
          matches: 0,
          wins: 0,
          draws: 0,
          losses: 0
        }
      }
      
      if (!teamStats[teamBKey]) {
        teamStats[teamBKey] = {
          players: match.teamB,
          goals: 0,
          matches: 0,
          wins: 0,
          draws: 0,
          losses: 0
        }
      }
      
      const teamAGoals = match.teamAGoals || 0
      const teamBGoals = match.teamBGoals || 0
      
      teamStats[teamAKey].goals += teamAGoals
      teamStats[teamAKey].matches += 1
      teamStats[teamBKey].goals += teamBGoals
      teamStats[teamBKey].matches += 1
      
      if (teamAGoals > teamBGoals) {
        teamStats[teamAKey].wins += 1
        teamStats[teamBKey].losses += 1
      } else if (teamBGoals > teamAGoals) {
        teamStats[teamBKey].wins += 1
        teamStats[teamAKey].losses += 1
      } else {
        teamStats[teamAKey].draws += 1
        teamStats[teamBKey].draws += 1
      }
    })
    
    return Object.values(teamStats)
  }

  const teamStats = calculateTeamStats()
  
  // Sort by goals scored (descending)
  const sortedTeams = teamStats.sort((a, b) => {
    if (b.goals !== a.goals) return b.goals - a.goals
    return b.wins - a.wins
  })

  const topTeams = sortedTeams.slice(0, 3) // Top 3 teams

  if (topTeams.length === 0) {
    return (
      <div className="team-of-month-card">
        <h3>Team of the Month</h3>
        <div className="empty-team">
          <p>No match scores recorded yet. Add scores to matches to see the best teams!</p>
        </div>
      </div>
    )
  }

  const getPlayerNames = (playerIds) => {
    return playerIds.map(id => {
      const player = players.find(p => p.id === id)
      return player ? player.name : 'Unknown'
    })
  }

  return (
    <div className="team-of-month-card">
      <h3>Top Teams of the Month</h3>
      <div className="top-teams-list">
        {topTeams.map((team, index) => (
          <div key={index} className="top-team-card">
            <div className="team-rank-badge">#{index + 1}</div>
            <div className="team-info">
              <div className="team-players-names">
                {getPlayerNames(team.players).map((name, i) => (
                  <span key={i} className="team-player-name">{name}</span>
                ))}
              </div>
              <div className="team-stats-row">
                <div className="team-stat-item">
                  <span className="stat-label-small">Goals:</span>
                  <span className="stat-value-small">{team.goals}</span>
                </div>
                <div className="team-stat-item">
                  <span className="stat-label-small">Wins:</span>
                  <span className="stat-value-small">{team.wins}</span>
                </div>
                <div className="team-stat-item">
                  <span className="stat-label-small">Matches:</span>
                  <span className="stat-value-small">{team.matches}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamOfTheMonth
