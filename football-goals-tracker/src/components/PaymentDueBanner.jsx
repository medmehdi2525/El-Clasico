import React, { useState, useEffect } from 'react'

function PaymentDueBanner({ payments, isAdmin, onNavigateToPayments }) {
  const [showBanner, setShowBanner] = useState(false)
  const [daysUntilDue, setDaysUntilDue] = useState(0)

  useEffect(() => {
    if (payments.length === 0) {
      setShowBanner(true)
      setDaysUntilDue(0)
      return
    }

    // Sort payments by date (most recent first)
    const sortedPayments = [...payments].sort((a, b) => new Date(b.date) - new Date(a.date))
    const lastPayment = sortedPayments[0]
    const lastPaymentDate = new Date(lastPayment.date)
    
    // Calculate next payment due date (30 days from last payment)
    const nextDueDate = new Date(lastPaymentDate)
    nextDueDate.setDate(nextDueDate.getDate() + 30)
    
    const today = new Date()
    const diffTime = nextDueDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    // Show banner if payment is due within 7 days or overdue
    if (diffDays <= 7) {
      setShowBanner(true)
      setDaysUntilDue(diffDays)
    } else {
      setShowBanner(false)
    }
  }, [payments])

  if (!showBanner) return null

  const isOverdue = daysUntilDue < 0
  const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0

  return (
    <div className={`payment-due-banner ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : 'upcoming'}`}>
      <div className="banner-content">
        <span className="banner-icon">💰</span>
        <div className="banner-text">
          {isOverdue ? (
            <span><strong>Payment Overdue!</strong> Monthly payment was due {Math.abs(daysUntilDue)} day{Math.abs(daysUntilDue) !== 1 ? 's' : ''} ago.</span>
          ) : daysUntilDue === 0 ? (
            <span><strong>Payment Due Today!</strong> Monthly payment is due today.</span>
          ) : (
            <span><strong>Payment Due Soon!</strong> Monthly payment is due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}.</span>
          )}
        </div>
        {isAdmin && (
          <button className="banner-action" onClick={onNavigateToPayments}>
            Pay Now
          </button>
        )}
      </div>
    </div>
  )
}

export default PaymentDueBanner
