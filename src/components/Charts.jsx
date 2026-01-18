import React, { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Charts = ({ currentYear, expenses }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#a1a1aa'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#a1a1aa' },
        grid: { color: '#27272a' }
      },
      y: {
        ticks: { color: '#a1a1aa' },
        grid: { color: '#27272a' }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#a1a1aa',
          padding: 20
        }
      }
    }
  }

  const getMonthlyTrendData = () => {
    const yearData = expenses[currentYear.toString()] || {}
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    const data = months.map((_, index) => {
      const monthData = yearData[index.toString()] || {}
      return Object.values(monthData).reduce((sum, amount) => sum + amount, 0)
    })

    return {
      labels: months,
      datasets: [{
        label: 'Monthly Expenses',
        data,
        borderColor: '#00ffff',
        backgroundColor: 'rgba(0, 255, 255, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    }
  }

  const getCategoryData = () => {
    const yearData = expenses[currentYear.toString()] || {}
    const categoryTotals = {}

    Object.values(yearData).forEach(monthData => {
      Object.entries(monthData).forEach(([category, amount]) => {
        categoryTotals[category] = (categoryTotals[category] || 0) + amount
      })
    })

    const colors = [
      '#00ffff', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b',
      '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
    ]

    return {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: colors,
        borderWidth: 0
      }]
    }
  }

  const getMonthlyBarData = () => {
    const yearData = expenses[currentYear.toString()] || {}
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    const data = months.map((_, index) => {
      const monthData = yearData[index.toString()] || {}
      return Object.values(monthData).reduce((sum, amount) => sum + amount, 0)
    })

    return {
      labels: months,
      datasets: [{
        label: 'Monthly Expenses',
        data,
        backgroundColor: '#00ffff',
        borderColor: '#00b4d8',
        borderWidth: 2,
        borderRadius: 8
      }]
    }
  }

  const getYearlyTrendData = () => {
    const years = Object.keys(expenses).map(y => parseInt(y)).sort()
    
    if (years.length === 0) {
      return {
        labels: [currentYear.toString()],
        datasets: [{
          label: 'Yearly Expenses',
          data: [0],
          borderColor: '#ec4899',
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      }
    }

    const data = years.map(year => {
      const yearData = expenses[year.toString()] || {}
      return Object.values(yearData).reduce((yearTotal, monthData) => {
        return yearTotal + Object.values(monthData).reduce((monthTotal, amount) => monthTotal + amount, 0)
      }, 0)
    })

    return {
      labels: years.map(year => year.toString()),
      datasets: [{
        label: 'Yearly Expenses',
        data,
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    }
  }

  return (
    <div className="charts-grid-2x2">
      <div className="chart-card">
        <h3 className="card-title">Monthly Trend</h3>
        <div className="chart-container">
          <Line data={getMonthlyTrendData()} options={chartOptions} />
        </div>
      </div>

      <div className="chart-card">
        <h3 className="card-title">Category Breakdown</h3>
        <div className="chart-container">
          <Doughnut data={getCategoryData()} options={doughnutOptions} />
        </div>
      </div>

      <div className="chart-card">
        <h3 className="card-title">Monthly Expenses</h3>
        <div className="chart-container">
          <Bar data={getMonthlyBarData()} options={chartOptions} />
        </div>
      </div>

      <div className="chart-card">
        <h3 className="card-title">Yearly Trend</h3>
        <div className="chart-container">
          <Line data={getYearlyTrendData()} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default Charts
