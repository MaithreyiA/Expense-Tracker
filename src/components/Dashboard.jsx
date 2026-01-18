import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import MainContent from './MainContent'
import { showNotification } from '../utils/notifications'

const Dashboard = ({ user, onLogout }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [balance, setBalance] = useState(0)
  const [expenses, setExpenses] = useState({})
  const [recurringExpenses, setRecurringExpenses] = useState({})

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    saveData()
  }, [balance, expenses, recurringExpenses])

  const getUserStorageKey = (key) => {
    return `${key}_${user.email || user.nickname}`
  }

  const loadData = () => {
    try {
      const savedBalance = localStorage.getItem(getUserStorageKey('budgetProBalance'))
      const savedExpenses = localStorage.getItem(getUserStorageKey('budgetProExpenses'))
      const savedRecurring = localStorage.getItem(getUserStorageKey('budgetProRecurring'))

      if (savedBalance) setBalance(parseFloat(savedBalance))
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses))
      if (savedRecurring) setRecurringExpenses(JSON.parse(savedRecurring))
    } catch (error) {
      console.error('Error loading data:', error)
      showNotification('Error loading saved data', 'error')
    }
  }

  const saveData = () => {
    try {
      localStorage.setItem(getUserStorageKey('budgetProBalance'), balance.toString())
      localStorage.setItem(getUserStorageKey('budgetProExpenses'), JSON.stringify(expenses))
      localStorage.setItem(getUserStorageKey('budgetProRecurring'), JSON.stringify(recurringExpenses))
    } catch (error) {
      console.error('Error saving data:', error)
      showNotification('Error saving data', 'error')
    }
  }

  const addExpense = (category, amount) => {
    const yearKey = currentYear.toString()
    const monthKey = currentMonth.toString()

    setExpenses(prev => {
      const newExpenses = { ...prev }
      if (!newExpenses[yearKey]) newExpenses[yearKey] = {}
      if (!newExpenses[yearKey][monthKey]) newExpenses[yearKey][monthKey] = {}
      
      const currentAmount = newExpenses[yearKey][monthKey][category] || 0
      newExpenses[yearKey][monthKey][category] = currentAmount + amount
      
      return newExpenses
    })

    setBalance(prev => prev - amount)
    showNotification(`Added ₹${amount} to ${category}`, 'success')
  }

  const addCredit = (amount) => {
    setBalance(prev => prev + amount)
    showNotification(`Added ₹${amount} to balance`, 'success')
  }

  const addRecurringExpense = (expense) => {
    const id = Date.now().toString()
    setRecurringExpenses(prev => ({
      ...prev,
      [id]: { ...expense, id, active: true }
    }))
    showNotification(`Added recurring expense: ${expense.name}`, 'success')
  }

  const toggleRecurringExpense = (id) => {
    setRecurringExpenses(prev => ({
      ...prev,
      [id]: { ...prev[id], active: !prev[id].active }
    }))
  }

  const deleteRecurringExpense = (id) => {
    setRecurringExpenses(prev => {
      const newExpenses = { ...prev }
      delete newExpenses[id]
      return newExpenses
    })
    showNotification('Recurring expense deleted', 'success')
  }

  return (
    <div className="dashboard">
      <Sidebar
        user={user}
        balance={balance}
        recurringExpenses={recurringExpenses}
        onAddCredit={addCredit}
        onAddRecurringExpense={addRecurringExpense}
        onToggleRecurringExpense={toggleRecurringExpense}
        onDeleteRecurringExpense={deleteRecurringExpense}
        onLogout={onLogout}
      />
      <MainContent
        currentYear={currentYear}
        currentMonth={currentMonth}
        expenses={expenses}
        onAddExpense={addExpense}
        onYearChange={setCurrentYear}
        onMonthChange={setCurrentMonth}
      />
    </div>
  )
}

export default Dashboard
