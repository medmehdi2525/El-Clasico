import React, { useState, useEffect } from 'react'
import Login from './components/Login'
import Navigation from './components/Navigation'
import TopScorerBanner from './components/TopScorerBanner'
import StatisticsPanel from './components/StatisticsPanel'
import TeamOfTheMonth from './components/TeamOfTheMonth'
import TeamDivider from './components/TeamDivider'
import PaymentTracker from './components/PaymentTracker'
import PaymentDueBanner from './components/PaymentDueBanner'
import PlayerCard from './components/PlayerCard'
import AddPlayerModal from './components/AddPlayerModal'
import EditPlayerModal from './components/EditPlayerModal'
import PlayerDetailsModal from './components/PlayerDetailsModal'
import MatchScoreModal from './components/MatchScoreModal'
import { getStorage, setStorage } from './utils/storage'

function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [players, setPlayers] = useState([])
  const [matches, setMatches] = useState([])
  const [payments, setPayments] = useState([])
  const [showTeamDivider, setShowTeamDivider] = useState(false)
  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [showEditPlayer, setShowEditPlayer] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState(null)
  const [showPlayerDetails, setShowPlayerDetails] = useState(false)
  const [selectedPlayerDetails, setSelectedPlayerDetails] = useState(null)
  const [showMatchScore, setShowMatchScore] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [selectedPlayers, setSelectedPlayers] = useState(new Set())

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const isAdmin = user && user.isAdmin

  // Load data from storage on mount - FIXED to ensure persistence
  useEffect(() => {
    try {
      const savedData = getStorage('elClasico')
      if (savedData) {
        if (savedData.players) setPlayers(savedData.players)
        if (savedData.matches) setMatches(savedData.matches)
        if (savedData.payments) setPayments(savedData.payments)
      }
      const savedUser = getStorage('elClasicoUser')
      if (savedUser && savedUser.isAdmin) {
        setUser(savedUser)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }, [])

  // Save data to storage whenever it changes - FIXED to ensure persistence
  useEffect(() => {
    try {
      const data = { players, matches, payments }
      setStorage('elClasico', data)
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }, [players, matches, payments])

  useEffect(() => {
    if (user && user.isAdmin) {
      setStorage('elClasicoUser', user)
    } else {
      setStorage('elClasicoUser', null)
    }
  }, [user])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
    setShowProfileMenu(false)
  }

  // Admin-only functions
  const addPlayer = (name) => {
    if (!isAdmin) return
    const newPlayer = {
      id: Date.now().toString(),
      name,
      isPermanent: true,
      totalGoals: 0,
      monthlyGoals: {},
      matchPeriodGoals: {}, // Track goals per match period
      matchesPlayed: 0,
      assists: 0,
      mvps: 0,
      currentStreak: 0,
      lastGoalDate: null,
      lastMatchDate: null // Track when player last played a match
    }
    setPlayers([...players, newPlayer])
  }

  const updatePlayer = (updatedPlayer) => {
    if (!isAdmin) return
    setPlayers(players.map(p => p.id === updatedPlayer.id ? updatedPlayer : p))
  }

  const deletePlayer = (id) => {
    if (!isAdmin) return
    if (window.confirm('Delete this player?')) {
      setPlayers(players.filter(p => p.id !== id))
      setSelectedPlayers(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const togglePlayerType = (id) => {
    if (!isAdmin) return
    setPlayers(players.map(p => 
      p.id === id ? { ...p, isPermanent: !p.isPermanent } : p
    ))
  }

  const addGoal = (id) => {
    if (!isAdmin) return
    const today = new Date()
    const monthKey = `${today.getFullYear()}-${today.getMonth()}`
    const todayStr = today.toDateString()

    setPlayers(players.map(p => {
      if (p.id !== id) return p

      const newMonthlyGoals = { ...p.monthlyGoals }
      newMonthlyGoals[monthKey] = (newMonthlyGoals[monthKey] || 0) + 1

      // Track match period goals - count goals since last match
      const newMatchPeriodGoals = { ...p.matchPeriodGoals }
      const lastMatchDate = p.lastMatchDate || 'start'
      if (!newMatchPeriodGoals[lastMatchDate]) {
        newMatchPeriodGoals[lastMatchDate] = 0
      }
      newMatchPeriodGoals[lastMatchDate] = (newMatchPeriodGoals[lastMatchDate] || 0) + 1

      let newStreak = p.currentStreak
      if (p.lastGoalDate === todayStr) {
        // Already scored today
      } else if (p.lastGoalDate === new Date(today.getTime() - 86400000).toDateString()) {
        newStreak = p.currentStreak + 1
      } else {
        newStreak = 1
      }

      return {
        ...p,
        totalGoals: p.totalGoals + 1,
        monthlyGoals: newMonthlyGoals,
        matchPeriodGoals: newMatchPeriodGoals,
        currentStreak: newStreak,
        lastGoalDate: todayStr
      }
    }))
  }

  const removeGoal = (id) => {
    if (!isAdmin) return
    const today = new Date()
    const monthKey = `${today.getFullYear()}-${today.getMonth()}`

    setPlayers(players.map(p => {
      if (p.id !== id || p.totalGoals === 0) return p

      const newMonthlyGoals = { ...p.monthlyGoals }
      if (newMonthlyGoals[monthKey] > 0) {
        newMonthlyGoals[monthKey] = newMonthlyGoals[monthKey] - 1
      }

      // Update match period goals
      const newMatchPeriodGoals = { ...p.matchPeriodGoals }
      const lastMatchDate = p.lastMatchDate || 'start'
      if (newMatchPeriodGoals[lastMatchDate] && newMatchPeriodGoals[lastMatchDate] > 0) {
        newMatchPeriodGoals[lastMatchDate] = newMatchPeriodGoals[lastMatchDate] - 1
      }

      return {
        ...p,
        totalGoals: Math.max(0, p.totalGoals - 1),
        monthlyGoals: newMonthlyGoals,
        matchPeriodGoals: newMatchPeriodGoals
      }
    }))
  }

  const togglePlayerSelection = (id) => {
    if (!isAdmin) return
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

  const selectAllPlayers = () => {
    if (!isAdmin) return
    setSelectedPlayers(new Set(players.map(p => p.id)))
  }

  const clearSelection = () => {
    if (!isAdmin) return
    setSelectedPlayers(new Set())
  }

  const logMatch = (teamAIds, teamBIds) => {
    if (!isAdmin) return
    const matchDate = new Date().toISOString()
    const allParticipatingIds = [...teamAIds, ...teamBIds]
    
    // Update players: increment matches played and reset match period goals tracking
    setPlayers(players.map(p => {
      if (allParticipatingIds.includes(p.id)) {
        // Reset match period goals for new period starting with this match
        const newMatchPeriodGoals = { ...p.matchPeriodGoals }
        newMatchPeriodGoals[matchDate] = 0 // Start new period
        
        return {
          ...p,
          matchesPlayed: p.matchesPlayed + 1,
          lastMatchDate: matchDate,
          matchPeriodGoals: newMatchPeriodGoals
        }
      }
      return p
    }))
    
    setMatches([...matches, {
      id: Date.now().toString(),
      date: matchDate,
      teamA: teamAIds,
      teamB: teamBIds,
      teamAGoals: 0,
      teamBGoals: 0,
      won: false
    }])
    setShowTeamDivider(false)
    setSelectedPlayers(new Set())
    alert('Match logged successfully! Add scores in Match History.')
  }

  const updateMatchScore = (updatedMatch) => {
    if (!isAdmin) return
    setMatches(matches.map(m => m.id === updatedMatch.id ? updatedMatch : m))
  }

  const deleteMatch = (matchId) => {
    if (!isAdmin) return
    if (window.confirm('Delete this match?')) {
      setMatches(matches.filter(m => m.id !== matchId))
    }
  }

  // Calculate consecutive matches scoring for a player
  const getConsecutiveScoring = (player) => {
    const playerMatches = matches
      .filter(m => (m.teamA.includes(player.id) || m.teamB.includes(player.id)) && m.teamAGoals !== undefined && m.teamBGoals !== undefined)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    
    let consecutive = 0
    for (let match of playerMatches) {
      const wasInTeamA = match.teamA.includes(player.id)
      const teamGoals = wasInTeamA ? (match.teamAGoals || 0) : (match.teamBGoals || 0)
      if (teamGoals > 0) {
        consecutive++
      } else {
        break
      }
    }
    return consecutive
  }

  const addPayment = (amount, date) => {
    if (!isAdmin) return
    setPayments([...payments, {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      date: date || new Date().toISOString()
    }])
  }

  const deletePayment = (id) => {
    if (!isAdmin) return
    if (window.confirm('Delete this payment?')) {
      setPayments(payments.filter(p => p.id !== id))
    }
  }

  const exportData = () => {
    if (!isAdmin) return
    const data = { players, payments, matches }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const dateStr = new Date().toISOString().split('T')[0]
    a.href = url
    a.download = `el-clasico-${dateStr}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (event) => {
    if (!isAdmin) return
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (data.players) setPlayers(data.players)
        if (data.payments) setPayments(data.payments)
        if (data.matches) setMatches(data.matches)
        alert('Data imported successfully!')
      } catch (error) {
        alert('Error importing data: ' + error.message)
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  // Get current month goals for ranking
  const getCurrentMonthGoals = (player) => {
    const monthKey = `${currentYear}-${currentMonth}`
    return player.monthlyGoals[monthKey] || 0
  }

  // Get match period goals (goals scored since last match or before next match)
  const getMatchPeriodGoals = (player, matchesList) => {
    if (!player.matchPeriodGoals) return 0
    
    // Get the most recent match date for this player
    const playerMatches = matchesList.filter(m => 
      m.teamA.includes(player.id) || m.teamB.includes(player.id)
    ).sort((a, b) => new Date(b.date) - new Date(a.date))
    
    const lastMatchDate = playerMatches.length > 0 ? playerMatches[0].date : 'start'
    
    // Return goals scored in the current match period
    return player.matchPeriodGoals[lastMatchDate] || 0
  }

  // Sort players by current month goals (descending)
  const sortedPlayers = [...players].sort((a, b) => {
    const aGoals = getCurrentMonthGoals(a)
    const bGoals = getCurrentMonthGoals(b)
    if (bGoals !== aGoals) return bGoals - aGoals
    return b.totalGoals - a.totalGoals
  })

  // Get top scorer
  const topScorer = sortedPlayers.length > 0 ? sortedPlayers[0] : null
  const topScorerMonthlyGoals = topScorer ? getCurrentMonthGoals(topScorer) : 0
  const topScorerConsecutive = topScorer ? getConsecutiveScoring(topScorer) : 0

  // Calculate statistics
  const totalPlayers = players.length
  const currentMonthTotalGoals = players.reduce((sum, p) => sum + getCurrentMonthGoals(p), 0)
  const allTimeTotalGoals = players.reduce((sum, p) => sum + p.totalGoals, 0)
  const avgGoalsPerPlayer = totalPlayers > 0 ? (allTimeTotalGoals / totalPlayers).toFixed(1) : 0
  const totalMatchesPlayed = matches.length

  // Render page content
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <>
            {topScorer && topScorerMonthlyGoals > 0 && (
              <TopScorerBanner 
                player={topScorer} 
                monthlyGoals={topScorerMonthlyGoals}
                consecutiveScoring={topScorerConsecutive}
              />
            )}
            <StatisticsPanel
              totalPlayers={totalPlayers}
              currentMonthTotalGoals={currentMonthTotalGoals}
              allTimeTotalGoals={allTimeTotalGoals}
              avgGoalsPerPlayer={avgGoalsPerPlayer}
              totalMatchesPlayed={totalMatchesPlayed}
              currentMonth={currentMonth}
              currentYear={currentYear}
            />
            <TeamOfTheMonth 
              players={players} 
              matches={matches}
            />
          </>
        )
      
      case 'players':
        return (
          <div className="players-section">
            <div className="section-header">
              <h2 className="section-title">
                Player Leaderboard - {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              {isAdmin && (
                <button className="btn-admin-control" onClick={() => setShowAddPlayer(true)}>
                  ➕ Add Player
                </button>
              )}
            </div>
            <div className="players-grid-dark">
              {sortedPlayers.map((player, index) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  rank={index + 1}
                  monthlyGoals={getCurrentMonthGoals(player)}
                  onAddGoal={isAdmin ? () => addGoal(player.id) : null}
                  onRemoveGoal={isAdmin ? () => removeGoal(player.id) : null}
                  onDelete={isAdmin ? () => deletePlayer(player.id) : null}
                  onEdit={isAdmin ? () => {
                    setEditingPlayer(player)
                    setShowEditPlayer(true)
                  } : null}
                  onViewDetails={() => {
                    setSelectedPlayerDetails(player)
                    setShowPlayerDetails(true)
                  }}
                  onToggleType={isAdmin ? () => togglePlayerType(player.id) : null}
                  isSelected={selectedPlayers.has(player.id)}
                  onToggleSelection={isAdmin ? () => togglePlayerSelection(player.id) : null}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
            {sortedPlayers.length === 0 && (
              <div className="empty-state">
                <p>No players yet. {isAdmin ? 'Add your first player to get started!' : 'Check back soon for player statistics.'}</p>
              </div>
            )}
          </div>
        )
      
      case 'teams':
        return (
          <div className="teams-page">
            {isAdmin && (
              <div className="admin-controls">
                <button className="btn-admin-control" onClick={() => setShowTeamDivider(true)}>
                  👥 Divide Teams & Log Match
                </button>
              </div>
            )}
            <TeamOfTheMonth 
              players={players} 
              matches={matches}
            />
          </div>
        )
      
      case 'matches':
        return (
          <div className="matches-page">
            <div className="section-header">
              <h2 className="section-title">Match History</h2>
              {isAdmin && (
                <button className="btn-admin-control" onClick={() => setShowTeamDivider(true)}>
                  ➕ Log New Match
                </button>
              )}
            </div>
            <div className="matches-list">
              {matches.length === 0 ? (
                <div className="empty-state">
                  <p>No matches logged yet.</p>
                </div>
              ) : (
                matches.slice().reverse().map(match => {
                  const teamAGoals = match.teamAGoals !== undefined ? match.teamAGoals : null
                  const teamBGoals = match.teamBGoals !== undefined ? match.teamBGoals : null
                  const hasScore = teamAGoals !== null && teamBGoals !== null
                  
                  return (
                    <div key={match.id} className="match-card">
                      <div className="match-header">
                        <div className="match-date">
                          {new Date(match.date).toLocaleDateString()}
                        </div>
                        {isAdmin && (
                          <div className="match-actions">
                            <button 
                              className="btn-action-small"
                              onClick={() => {
                                setSelectedMatch(match)
                                setShowMatchScore(true)
                              }}
                            >
                              {hasScore ? '✏️ Edit Score' : '➕ Add Score'}
                            </button>
                            <button 
                              className="btn-delete-small"
                              onClick={() => deleteMatch(match.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="match-teams">
                        <div className="match-team">
                          <strong>Team A:</strong> {match.teamA.map(id => {
                            const player = players.find(p => p.id === id)
                            return player ? player.name : 'Unknown'
                          }).join(', ')}
                        </div>
                        <div className="match-team">
                          <strong>Team B:</strong> {match.teamB.map(id => {
                            const player = players.find(p => p.id === id)
                            return player ? player.name : 'Unknown'
                          }).join(', ')}
                        </div>
                      </div>
                      {hasScore && (
                        <div className="match-score-display">
                          <span className="score-team-a">{teamAGoals}</span>
                          <span className="match-score-separator">-</span>
                          <span className="score-team-b">{teamBGoals}</span>
                        </div>
                      )}
                      {!hasScore && isAdmin && (
                        <div className="match-score-prompt">
                          Click "Add Score" to record match result
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )
      
      case 'payments':
        return (
          <PaymentTracker
            payments={payments}
            onAddPayment={isAdmin ? addPayment : null}
            onDeletePayment={isAdmin ? deletePayment : null}
            isAdmin={isAdmin}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="app-dark">
      <div className="container-dark">
        {/* Header */}
        <header className="header-dark">
          <div className="logo">
            <span className="logo-el">EL</span>
            <span className="logo-clasico">CLÁSICO</span>
          </div>
          <div className="header-right">
            {!isAdmin && (
              <button 
                className="btn-login-header"
                onClick={() => setShowLoginModal(true)}
              >
                Admin Login
              </button>
            )}
            {isAdmin && (
              <div className="profile-menu-container">
                <button 
                  className="btn-profile"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  ME
                </button>
                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <div className="profile-item">PROFILE</div>
                    <div className="profile-email">{user.email}</div>
                    <div className="profile-item">
                      <label className="btn-admin-control" style={{ margin: 0, cursor: 'pointer' }}>
                        📥 Import
                        <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
                      </label>
                    </div>
                    <div className="profile-item">
                      <button className="btn-admin-control" onClick={exportData} style={{ width: '100%', margin: 0 }}>
                        📤 Export
                      </button>
                    </div>
                    <div className="profile-item logout" onClick={handleLogout}>
                      Log Out
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Payment Due Banner */}
        <PaymentDueBanner 
          payments={payments} 
          isAdmin={isAdmin}
          onNavigateToPayments={() => setCurrentPage('payments')}
        />

        {/* Admin Mode Indicator */}
        {isAdmin && (
          <>
            <div className="admin-banner">
              <span className="admin-indicator">🔒 ADMIN MODE - You can edit data</span>
            </div>
            <div className="admin-controls-panel">
              <h4>Admin Controls</h4>
              <div className="admin-controls-grid">
                <button className="btn-admin-control" onClick={() => setShowAddPlayer(true)}>
                  ➕ Add Player
                </button>
                <button className="btn-admin-control" onClick={() => setShowTeamDivider(true)}>
                  👥 Divide Teams
                </button>
                <button className="btn-admin-control" onClick={exportData}>
                  📤 Export Data
                </button>
                <label className="btn-admin-control">
                  📥 Import Data
                  <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
                </label>
                <button 
                  className="btn-admin-control btn-danger"
                  onClick={() => {
                    if (window.confirm('Clear all players? This cannot be undone!')) {
                      setPlayers([])
                    }
                  }}
                >
                  🗑️ Clear Players
                </button>
                <button 
                  className="btn-admin-control btn-danger"
                  onClick={() => {
                    if (window.confirm('Clear all matches? This cannot be undone!')) {
                      setMatches([])
                    }
                  }}
                >
                  🗑️ Clear Matches
                </button>
              </div>
            </div>
          </>
        )}

        {/* Navigation */}
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} isAdmin={isAdmin} />

        {/* Page Content */}
        <div className="page-content">
          {renderPage()}
        </div>

        {/* Modals */}
        {showAddPlayer && isAdmin && (
          <AddPlayerModal
            onClose={() => setShowAddPlayer(false)}
            onAdd={addPlayer}
          />
        )}

        {showEditPlayer && isAdmin && editingPlayer && (
          <EditPlayerModal
            player={editingPlayer}
            onClose={() => {
              setShowEditPlayer(false)
              setEditingPlayer(null)
            }}
            onSave={updatePlayer}
          />
        )}

        {showTeamDivider && isAdmin && (
          <TeamDivider
            players={players}
            selectedPlayers={selectedPlayers}
            onClose={() => {
              setShowTeamDivider(false)
              setSelectedPlayers(new Set())
            }}
            onSelectAll={selectAllPlayers}
            onClearSelection={clearSelection}
            onToggleSelection={togglePlayerSelection}
            onLogMatch={logMatch}
            getCurrentMonthGoals={getCurrentMonthGoals}
          />
        )}

        {/* Login Modal */}
        {showLoginModal && (
          <Login 
            onLogin={(userData) => {
              handleLogin(userData)
              setShowLoginModal(false)
            }} 
            onClose={() => setShowLoginModal(false)}
          />
        )}

        {/* Player Details Modal */}
        {showPlayerDetails && selectedPlayerDetails && (
          <PlayerDetailsModal
            player={selectedPlayerDetails}
            monthlyGoals={getCurrentMonthGoals(selectedPlayerDetails)}
            allTimeGoals={selectedPlayerDetails.totalGoals}
            matchesPlayed={selectedPlayerDetails.matchesPlayed}
            matches={matches}
            onClose={() => {
              setShowPlayerDetails(false)
              setSelectedPlayerDetails(null)
            }}
          />
        )}

        {/* Match Score Modal */}
        {showMatchScore && selectedMatch && (
          <MatchScoreModal
            match={selectedMatch}
            players={players}
            isAdmin={isAdmin}
            onClose={() => {
              setShowMatchScore(false)
              setSelectedMatch(null)
            }}
            onSave={updateMatchScore}
          />
        )}
      </div>
    </div>
  )
}

export default App
