import React, { useState } from 'react'
import ExpenseForm from './ExpenseForm'
import Charts from './Charts'
import { exportToPDF } from '../utils/pdfExport'

const MainContent = ({ currentYear, currentMonth, expenses, onAddExpense, onYearChange, onMonthChange }) => {
  const currentRealYear = new Date().getFullYear()
  const years = [currentRealYear] // Only current year
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const handleExportPDF = async () => {
    try {
      await exportToPDF(currentYear, expenses)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  return (
    <div className="main-content">
      <div className="main-header">
        <div className="header-content">
          <h1 className="main-title">Expense Dashboard</h1>
          
          <div className="time-period-controls">
            <select 
              value={currentMonth} 
              onChange={(e) => onMonthChange(parseInt(e.target.value))}
              className="form-select header-select"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <select 
              value={currentYear} 
              onChange={(e) => onYearChange(parseInt(e.target.value))}
              className="form-select header-select"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <button 
            className="btn btn-primary export-btn-header" 
            onClick={handleExportPDF}
          >
            Export PDF Report
          </button>
        </div>
      </div>

      <div className="content-grid">
        <ExpenseForm 
          currentYear={currentYear}
          currentMonth={currentMonth}
          expenses={expenses}
          onAddExpense={onAddExpense}
        />
        
        <div className="charts-section">
          <Charts 
            currentYear={currentYear}
            currentMonth={currentMonth}
            expenses={expenses}
          />
        </div>
      </div>
    </div>
  )
}

export default MainContent
