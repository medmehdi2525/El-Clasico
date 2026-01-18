import React from 'react'

function TopScorerBanner({ player, monthlyGoals, consecutiveScoring }) {
  const isOnFire = consecutiveScoring >= 2

  return (
    <div className="top-scorer-banner">
      <div className="top-scorer-content">
        <div className="trophy-icon">🏆</div>
        <div className="top-scorer-info">
          <div className="top-scorer-label">Top Scorer This Month</div>
          <div className="top-scorer-name">
            {player.name}
            {isOnFire && (
              <span className="on-fire-indicator"> 🔥 On Fire ({consecutiveScoring} matches)</span>
            )}
          </div>
          <div className="top-scorer-goals">{monthlyGoals} {monthlyGoals === 1 ? 'Goal' : 'Goals'}</div>
        </div>
        <div className="trophy-icon">🏆</div>
      </div>
    </div>
  )
}

export default TopScorerBanner
