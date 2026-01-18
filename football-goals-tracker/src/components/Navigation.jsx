import React from 'react'

function Navigation({ currentPage, onPageChange, isAdmin }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'players', label: 'Players', icon: '👥' },
    { id: 'teams', label: 'Teams', icon: '⚽' },
    { id: 'matches', label: 'Matches', icon: '🏟️' },
    { id: 'payments', label: 'Payments', icon: '💰' },
  ]

  return (
    <nav className="main-nav">
      <div className="nav-items">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onPageChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export default Navigation
