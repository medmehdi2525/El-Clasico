import React, { useState } from 'react'

function Login({ onLogin, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Admin credentials
    const adminEmail = 'admin@elclasico.com'
    const adminPassword = 'admin123'

    if (email === adminEmail && password === adminPassword) {
      onLogin({ email, isAdmin: true })
      if (onClose) onClose()
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-card modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="login-header">
          <h1>
            <span className="logo-el">EL</span>
            <span className="logo-clasico">CLÁSICO</span>
          </h1>
          <p>Admin Login</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@elclasico.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="btn-login">
            Login
          </button>
        </form>
        <div className="login-hint">
          <p>Default: admin@elclasico.com / admin123</p>
        </div>
        {onClose && (
          <button className="btn-close-login" onClick={onClose}>
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

export default Login
