import React from 'react'

function PlayerCard({ player, rank, monthlyGoals, onAddGoal, onRemoveGoal, onDelete, onToggleType, isSelected, onToggleSelection }) {
  const getRankIcon = () => {
    if (rank === 1) return '🏆'
    return `#${rank}`
  }

  return (
    <div 
      className={`player-card ${isSelected ? 'selected' : ''} ${rank === 1 ? 'top-player' : ''}`}
      onClick={onToggleSelection}
    >
      <div className="player-card-header">
        <div className="player-rank">{getRankIcon()}</div>
        <div className="player-name">{player.name}</div>
        <button 
          className="btn-badge"
          onClick={(e) => {
            e.stopPropagation()
            onToggleType()
          }}
          title={player.isPermanent ? 'Permanent Player' : 'Temporary Player'}
        >
          {player.isPermanent ? '👤' : '👥'}
        </button>
      </div>

      <div className="player-stats">
        <div className="stat-item">
          <span className="stat-label">Monthly Goals:</span>
          <span className="stat-value">{monthlyGoals}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Goals:</span>
          <span className="stat-value">{player.totalGoals}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Matches:</span>
          <span className="stat-value">{player.matchesPlayed}</span>
        </div>
        {player.currentStreak > 0 && (
          <div className="stat-item streak">
            <span className="stat-label">🔥 Streak:</span>
            <span className="stat-value">{player.currentStreak} days</span>
          </div>
        )}
      </div>

      <div className="player-actions">
        <button 
          className="btn-goal btn-add"
          onClick={(e) => {
            e.stopPropagation()
            onAddGoal()
          }}
        >
          ➕ Add Goal
        </button>
        <button 
          className="btn-goal btn-remove"
          onClick={(e) => {
            e.stopPropagation()
            onRemoveGoal()
          }}
          disabled={player.totalGoals === 0}
        >
          ➖ Remove Goal
        </button>
        <button 
          className="btn-delete"
          onClick={(e) => {
            e.stopPropagation()
            if (window.confirm(`Delete ${player.name}?`)) {
              onDelete()
            }
          }}
        >
          🗑️
        </button>
      </div>

      {isSelected && (
        <div className="selection-indicator">✓ Selected</div>
      )}
    </div>
  )
}

export default PlayerCard
