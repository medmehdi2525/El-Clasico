import React, { useState, useEffect } from 'react'

function EditPlayerModal({ player, onClose, onSave }) {
  const [name, setName] = useState('')
  const [isPermanent, setIsPermanent] = useState(true)

  useEffect(() => {
    if (player) {
      setName(player.name)
      setIsPermanent(player.isPermanent)
    }
  }, [player])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onSave({
        ...player,
        name: name.trim(),
        isPermanent
      })
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Player</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Player Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Enter player name"
              autoFocus
              required
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={isPermanent}
                onChange={(e) => setIsPermanent(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Permanent Player
            </label>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPlayerModal
