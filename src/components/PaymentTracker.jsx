import React, { useState } from 'react'

function PaymentTracker({ payments, onAddPayment, onDeletePayment }) {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }
    onAddPayment(amount, date)
    setAmount('')
    setDate(new Date().toISOString().split('T')[0])
  }

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)

  const sortedPayments = [...payments].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="payment-tracker">
      <h3>💰 Stadium Payment Tracker</h3>
      
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label>
            💵 Amount ($):
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            📅 Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Payment
        </button>
      </form>

      <div className="payment-total">
        <strong>Total Paid: ${totalPaid.toFixed(2)}</strong>
      </div>

      <div className="payments-list">
        {sortedPayments.length === 0 ? (
          <p className="empty-message">No payments recorded yet.</p>
        ) : (
          sortedPayments.map(payment => (
            <div key={payment.id} className="payment-item">
              <div className="payment-info">
                <span className="payment-date">
                  📅 {new Date(payment.date).toLocaleDateString()}
                </span>
                <span className="payment-amount">${payment.amount.toFixed(2)}</span>
              </div>
              <button
                className="btn-delete-small"
                onClick={() => {
                  if (window.confirm('Delete this payment?')) {
                    onDeletePayment(payment.id)
                  }
                }}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PaymentTracker
