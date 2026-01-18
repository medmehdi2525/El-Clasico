import React from 'react'

function StatisticsPanel({ 
  totalPlayers, 
  currentMonthTotalGoals, 
  allTimeTotalGoals, 
  avgGoalsPerPlayer, 
  totalMatchesPlayed,
  currentMonth,
  currentYear
}) {
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })

  return (
    <div className="statistics-panel">
      <h3>📊 Live Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-number">{totalPlayers}</div>
          <div className="stat-description">Total Players</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚽</div>
          <div className="stat-number">{currentMonthTotalGoals}</div>
          <div className="stat-description">Goals This Month ({monthName})</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-number">{allTimeTotalGoals}</div>
          <div className="stat-description">Total Goals All-Time</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-number">{avgGoalsPerPlayer}</div>
          <div className="stat-description">Avg Goals Per Player</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏟️</div>
          <div className="stat-number">{totalMatchesPlayed}</div>
          <div className="stat-description">Matches Played</div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsPanel
