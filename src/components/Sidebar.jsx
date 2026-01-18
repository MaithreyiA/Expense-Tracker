import React, { useState } from 'react'
import Modal from './Modal'

const Sidebar = ({
  user,
  balance,
  recurringExpenses,
  onAddCredit,
  onAddRecurringExpense,
  onToggleRecurringExpense,
  onDeleteRecurringExpense,
  onLogout
}) => {
  const [showCreditModal, setShowCreditModal] = useState(false)
  const [showRecurringModal, setShowRecurringModal] = useState(false)
  const [creditAmount, setCreditAmount] = useState('')
  const [recurringForm, setRecurringForm] = useState({
    name: '',
    amount: '',
    category: ''
  })

  const handleAddCredit = () => {
    const amount = parseFloat(creditAmount)
    if (amount && amount > 0) {
      onAddCredit(amount)
      setCreditAmount('')
      setShowCreditModal(false)
    }
  }

  const handleAddRecurring = () => {
    const { name, amount, category } = recurringForm
    if (name && amount && parseFloat(amount) > 0) {
      onAddRecurringExpense({
        name,
        amount: parseFloat(amount),
        category: category || 'Subscription'
      })
      setRecurringForm({ name: '', amount: '', category: '' })
      setShowRecurringModal(false)
    }
  }

  return (
    <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">BudgetPro</div>
          <div className="user-info">Welcome, {user.nickname}!</div>
        </div>

      <div className="sidebar-section">
        <h3 className="section-title">Balance</h3>
        <div className="balance-card">
          <div className="balance-amount">₹{balance.toLocaleString()}</div>
          <div className="balance-label">Available Balance</div>
        </div>
        <button 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          onClick={() => setShowCreditModal(true)}
        >
          Add Credit
        </button>
      </div>

      <div className="sidebar-section">
        <h3 className="section-title">Recurring Expenses</h3>
        <div className="recurring-list">
          {Object.values(recurringExpenses).map(expense => (
            <div key={expense.id} className="recurring-item">
              <div className="recurring-info">
                <h4>{expense.name}</h4>
                <p>₹{expense.amount} • {expense.category}</p>
              </div>
              <div className="recurring-controls">
                <button
                  className={`toggle-btn ${expense.active ? 'active' : 'inactive'}`}
                  onClick={() => onToggleRecurringExpense(expense.id)}
                >
                  {expense.active ? 'ON' : 'OFF'}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => onDeleteRecurringExpense(expense.id)}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
        <button 
          className="btn btn-secondary" 
          style={{ width: '100%', marginTop: '1rem' }}
          onClick={() => setShowRecurringModal(true)}
        >
          Add Recurring Expense
        </button>
      </div>

      <div className="sidebar-section">
        <button 
          className="btn btn-danger" 
          style={{ width: '100%' }}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {/* Add Credit Modal */}
      {showCreditModal && (
        <Modal onClose={() => setShowCreditModal(false)}>
          <div className="modal-header">
            <h3 className="modal-title">Add Credit</h3>
            <button className="close-btn" onClick={() => setShowCreditModal(false)}>×</button>
          </div>
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              type="number"
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
              className="form-input"
              placeholder="Enter amount to add"
              min="0"
              step="0.01"
            />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAddCredit}>
            Add Credit
          </button>
        </Modal>
      )}

      {/* Add Recurring Expense Modal */}
      {showRecurringModal && (
        <Modal onClose={() => setShowRecurringModal(false)}>
          <div className="modal-header">
            <h3 className="modal-title">Add Recurring Expense</h3>
            <button className="close-btn" onClick={() => setShowRecurringModal(false)}>×</button>
          </div>
          <div className="form-group">
            <label className="form-label">Expense Name</label>
            <input
              type="text"
              value={recurringForm.name}
              onChange={(e) => setRecurringForm(prev => ({ ...prev, name: e.target.value }))}
              className="form-input"
              placeholder="e.g., Netflix Subscription"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Monthly Amount (₹)</label>
            <input
              type="number"
              value={recurringForm.amount}
              onChange={(e) => setRecurringForm(prev => ({ ...prev, amount: e.target.value }))}
              className="form-input"
              placeholder="Enter monthly amount"
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category (Optional)</label>
            <input
              type="text"
              value={recurringForm.category}
              onChange={(e) => setRecurringForm(prev => ({ ...prev, category: e.target.value }))}
              className="form-input"
              placeholder="e.g., Entertainment"
            />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAddRecurring}>
            Add Recurring Expense
          </button>
        </Modal>
      )}
    </div>
  )
}

export default Sidebar
