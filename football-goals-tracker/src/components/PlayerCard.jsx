import React from 'react'

function PlayerCard({ 
  player, 
  rank, 
  monthlyGoals, 
  onAddGoal, 
  onRemoveGoal, 
  onDelete,
  onEdit,
  onViewDetails,
  onToggleType, 
  isSelected, 
  onToggleSelection,
  isAdmin = false
}) {
  const getRankIcon = () => {
    if (rank === 1) return '🏆'
    return `#${rank}`
  }

  return (
    <div 
      className={`player-card-dark ${isSelected ? 'selected' : ''} ${rank === 1 ? 'top-player' : ''}`}
      onClick={isAdmin && onToggleSelection ? onToggleSelection : undefined}
      style={{ cursor: isAdmin && onToggleSelection ? 'pointer' : 'default' }}
    >
      <div className="player-header-dark">
        <div className="player-rank-dark">{getRankIcon()}</div>
        <div className="player-name-dark">{player.name}</div>
        {isAdmin && onToggleType && (
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
        )}
        {!isAdmin && (
          <span className="player-badge-readonly" title={player.isPermanent ? 'Permanent Player' : 'Temporary Player'}>
            {player.isPermanent ? '👤' : '👥'}
          </span>
        )}
      </div>

      <div className="player-stats-dark">
        <div className="player-stat-item">
          <span className="stat-label-readonly">Monthly Goals:</span>
          <span className="stat-value-readonly">{monthlyGoals}</span>
        </div>
        <div className="player-stat-item">
          <span className="stat-label-readonly">Total Goals:</span>
          <span className="stat-value-readonly">{player.totalGoals}</span>
        </div>
        <div className="player-stat-item">
          <span className="stat-label-readonly">Matches:</span>
          <span className="stat-value-readonly">{player.matchesPlayed}</span>
        </div>
        {player.currentStreak > 0 && (
          <div className="player-stat-item streak-item">
            <span className="stat-label-readonly">🔥 Streak:</span>
            <span className="stat-value-readonly">{player.currentStreak} days</span>
          </div>
        )}
      </div>

      <div className="player-actions-dark">
        {onViewDetails && (
          <button 
            className="btn-action btn-details"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails()
            }}
          >
            📊 Details
          </button>
        )}
        {isAdmin && (
          <>
            {onEdit && (
              <button 
                className="btn-action"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
              >
                ✏️ Edit
              </button>
            )}
            {onAddGoal && (
              <button 
                className="btn-action"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddGoal()
                }}
              >
                ➕ Goal
              </button>
            )}
            {onRemoveGoal && (
              <button 
                className="btn-action"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveGoal()
                }}
                disabled={player.totalGoals === 0}
              >
                ➖ Goal
              </button>
            )}
            {onDelete && (
              <button 
                className="btn-delete-dark"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
              >
                🗑️
              </button>
            )}
          </>
        )}
      </div>

      {isSelected && isAdmin && (
        <div className="selection-indicator">✓ Selected</div>
      )}
    </div>
  )
}

export default PlayerCard
