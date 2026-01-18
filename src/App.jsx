import React, { useState, useEffect } from 'react'
import PlayerCard from './components/PlayerCard'
import TopScorerBanner from './components/TopScorerBanner'
import StatisticsPanel from './components/StatisticsPanel'
import TeamDivider from './components/TeamDivider'
import PaymentTracker from './components/PaymentTracker'
import AddPlayerModal from './components/AddPlayerModal'
import { getStorage, setStorage } from './utils/storage'

function App() {
  const [players, setPlayers] = useState([])
  const [payments, setPayments] = useState([])
  const [matches, setMatches] = useState([])
  const [showStats, setShowStats] = useState(false)
  const [showPayments, setShowPayments] = useState(false)
  const [showTeamDivider, setShowTeamDivider] = useState(false)
  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [selectedPlayers, setSelectedPlayers] = useState(new Set())

  // Load data from storage on mount
  useEffect(() => {
    const savedData = getStorage('footballTracker')
    if (savedData) {
      setPlayers(savedData.players || [])
      setPayments(savedData.payments || [])
      setMatches(savedData.matches || [])
    }
  }, [])

  // Save data to storage whenever it changes
  useEffect(() => {
    const data = { players, payments, matches }
    setStorage('footballTracker', data)
  }, [players, payments, matches])

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const addPlayer = (name) => {
    const newPlayer = {
      id: Date.now().toString(),
      name,
      isPermanent: true,
      totalGoals: 0,
      monthlyGoals: {},
      matchesPlayed: 0,
      currentStreak: 0,
      lastGoalDate: null
    }
    setPlayers([...players, newPlayer])
  }

  const deletePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id))
    setSelectedPlayers(prev => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  const togglePlayerType = (id) => {
    setPlayers(players.map(p => 
      p.id === id ? { ...p, isPermanent: !p.isPermanent } : p
    ))
  }

  const addGoal = (id) => {
    const today = new Date()
    const monthKey = `${today.getFullYear()}-${today.getMonth()}`
    const todayStr = today.toDateString()

    setPlayers(players.map(p => {
      if (p.id !== id) return p

      const newMonthlyGoals = { ...p.monthlyGoals }
      newMonthlyGoals[monthKey] = (newMonthlyGoals[monthKey] || 0) + 1

      // Update streak
      let newStreak = p.currentStreak
      if (p.lastGoalDate === todayStr) {
        // Already scored today, don't increment streak
      } else if (p.lastGoalDate === new Date(today.getTime() - 86400000).toDateString()) {
        // Scored yesterday, continue streak
        newStreak = p.currentStreak + 1
      } else {
        // New streak
        newStreak = 1
      }

      return {
        ...p,
        totalGoals: p.totalGoals + 1,
        monthlyGoals: newMonthlyGoals,
        currentStreak: newStreak,
        lastGoalDate: todayStr
      }
    }))
  }

  const removeGoal = (id) => {
    const today = new Date()
    const monthKey = `${today.getFullYear()}-${today.getMonth()}`

    setPlayers(players.map(p => {
      if (p.id !== id || p.totalGoals === 0) return p

      const newMonthlyGoals = { ...p.monthlyGoals }
      if (newMonthlyGoals[monthKey] > 0) {
        newMonthlyGoals[monthKey] = newMonthlyGoals[monthKey] - 1
      }

      return {
        ...p,
        totalGoals: Math.max(0, p.totalGoals - 1),
        monthlyGoals: newMonthlyGoals
      }
    }))
  }

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

  const selectAllPlayers = () => {
    setSelectedPlayers(new Set(players.map(p => p.id)))
  }

  const clearSelection = () => {
    setSelectedPlayers(new Set())
  }

  const logMatch = (teamAIds, teamBIds) => {
    const allParticipatingIds = [...teamAIds, ...teamBIds]
    setPlayers(players.map(p => 
      allParticipatingIds.includes(p.id)
        ? { ...p, matchesPlayed: p.matchesPlayed + 1 }
        : p
    ))
    setMatches([...matches, {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      teamA: teamAIds,
      teamB: teamBIds
    }])
  }

  const addPayment = (amount, date) => {
    setPayments([...payments, {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      date: date || new Date().toISOString()
    }])
  }

  const deletePayment = (id) => {
    setPayments(payments.filter(p => p.id !== id))
  }

  const exportData = () => {
    const data = { players, payments, matches }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const dateStr = new Date().toISOString().split('T')[0]
    a.href = url
    a.download = `football-tracker-${dateStr}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (event) => {
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
    event.target.value = '' // Reset file input
  }

  // Get current month goals for ranking
  const getCurrentMonthGoals = (player) => {
    const monthKey = `${currentYear}-${currentMonth}`
    return player.monthlyGoals[monthKey] || 0
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

  // Calculate statistics
  const totalPlayers = players.length
  const currentMonthTotalGoals = players.reduce((sum, p) => sum + getCurrentMonthGoals(p), 0)
  const allTimeTotalGoals = players.reduce((sum, p) => sum + p.totalGoals, 0)
  const avgGoalsPerPlayer = totalPlayers > 0 ? (allTimeTotalGoals / totalPlayers).toFixed(1) : 0
  const totalMatchesPlayed = matches.length

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>⚽ Football Goals Tracker</h1>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => setShowStats(!showStats)}>
              📊 {showStats ? 'Hide' : 'Show'} Statistics
            </button>
            <button className="btn btn-secondary" onClick={() => setShowPayments(!showPayments)}>
              💰 {showPayments ? 'Hide' : 'Show'} Payments
            </button>
            <button className="btn btn-primary" onClick={() => setShowAddPlayer(true)}>
              ➕ Add Player
            </button>
            <button className="btn btn-primary" onClick={() => setShowTeamDivider(true)}>
              👥 Divide Teams
            </button>
            <div className="import-export">
              <label className="btn btn-secondary">
                📥 Import
                <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
              </label>
              <button className="btn btn-secondary" onClick={exportData}>
                📤 Export
              </button>
            </div>
          </div>
        </header>

        {topScorer && topScorerMonthlyGoals > 0 && (
          <TopScorerBanner player={topScorer} monthlyGoals={topScorerMonthlyGoals} />
        )}

        {showStats && (
          <StatisticsPanel
            totalPlayers={totalPlayers}
            currentMonthTotalGoals={currentMonthTotalGoals}
            allTimeTotalGoals={allTimeTotalGoals}
            avgGoalsPerPlayer={avgGoalsPerPlayer}
            totalMatchesPlayed={totalMatchesPlayed}
            currentMonth={currentMonth}
            currentYear={currentYear}
          />
        )}

        {showPayments && (
          <PaymentTracker
            payments={payments}
            onAddPayment={addPayment}
            onDeletePayment={deletePayment}
          />
        )}

        <div className="players-section">
          <h2>Player Leaderboard - {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          <div className="players-grid">
            {sortedPlayers.map((player, index) => (
              <PlayerCard
                key={player.id}
                player={player}
                rank={index + 1}
                monthlyGoals={getCurrentMonthGoals(player)}
                onAddGoal={() => addGoal(player.id)}
                onRemoveGoal={() => removeGoal(player.id)}
                onDelete={() => deletePlayer(player.id)}
                onToggleType={() => togglePlayerType(player.id)}
                isSelected={selectedPlayers.has(player.id)}
                onToggleSelection={() => togglePlayerSelection(player.id)}
              />
            ))}
          </div>
          {sortedPlayers.length === 0 && (
            <div className="empty-state">
              <p>No players yet. Add your first player to get started!</p>
            </div>
          )}
        </div>

        {showAddPlayer && (
          <AddPlayerModal
            onClose={() => setShowAddPlayer(false)}
            onAdd={addPlayer}
          />
        )}

        {showTeamDivider && (
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
      </div>
    </div>
  )
}

export default App
