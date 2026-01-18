import React, { useState } from 'react'

const ExpenseForm = ({ currentYear, currentMonth, expenses, onAddExpense }) => {
  const [category, setCategory] = useState('')
  const [customCategory, setCustomCategory] = useState('')
  const [amount, setAmount] = useState('')

  const defaultCategories = [
    'Clothes', 'Food', 'Haircare', 'Skincare', 'Transport', 
    'Games', 'Gold', 'R Deposit', 'Gift', 'Misc', 'Gym', 'Badminton'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const finalCategory = category === 'custom' ? customCategory : category
    const expenseAmount = parseFloat(amount)

    if (!finalCategory || !expenseAmount || expenseAmount <= 0) {
      return
    }

    onAddExpense(finalCategory, expenseAmount)
    setCategory('')
    setCustomCategory('')
    setAmount('')
  }

  const getCurrentMonthExpenses = () => {
    const yearKey = currentYear.toString()
    const monthKey = currentMonth.toString()
    return expenses[yearKey]?.[monthKey] || {}
  }

  const monthExpenses = getCurrentMonthExpenses()
  const monthTotal = Object.values(monthExpenses).reduce((sum, amount) => sum + amount, 0)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="expense-card">
      <h2 className="card-title">Add New Expense</h2>
      
      <form className="expense-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Current Period</label>
          <div style={{ 
            padding: '1rem', 
            background: 'var(--bg-card)', 
            borderRadius: '8px',
            color: 'var(--accent-cyan)',
            fontWeight: '600'
          }}>
            {months[currentMonth]} {currentYear}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
            required
          >
            <option value="">Select category...</option>
            {defaultCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
            <option value="custom">+ Add New Category</option>
          </select>
        </div>

        {category === 'custom' && (
          <div className="form-group">
            <label className="form-label">Custom Category</label>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="form-input"
              placeholder="Enter new category name"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input"
            placeholder="Enter amount"
            min="0"
            step="0.01"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Add Expense
        </button>
      </form>

      <div className="category-summary">
        <h3 className="card-title">Month Summary</h3>
        {Object.entries(monthExpenses).map(([cat, amt]) => (
          <div key={cat} className="summary-item">
            <span>{cat}</span>
            <span>₹{amt.toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-item">
          <span><strong>Total</strong></span>
          <span><strong>₹{monthTotal.toFixed(2)}</strong></span>
        </div>
      </div>
    </div>
  )
}

export default ExpenseForm
