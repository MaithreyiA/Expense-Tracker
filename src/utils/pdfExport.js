import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { showNotification } from './notifications'

export const exportToPDF = async (currentYear, expenses) => {
  try {
    showNotification('Generating PDF report...', 'warning')
    
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Title Page
    pdf.setFontSize(24)
    pdf.setTextColor(0, 255, 255)
    pdf.text('BudgetPro', pageWidth / 2, 40, { align: 'center' })
    
    pdf.setFontSize(18)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Expense Report', pageWidth / 2, 55, { align: 'center' })
    
    pdf.setFontSize(14)
    pdf.text(`Year: ${currentYear}`, pageWidth / 2, 70, { align: 'center' })
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 80, { align: 'center' })
    
    // Monthly Summary
    const yearData = expenses[currentYear.toString()] || {}
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    
    let yPosition = 100
    pdf.setFontSize(16)
    pdf.text('Monthly Summary', 20, yPosition)
    yPosition += 15
    
    pdf.setFontSize(12)
    let yearTotal = 0
    
    months.forEach((month, index) => {
      const monthData = yearData[index.toString()] || {}
      const monthTotal = Object.values(monthData).reduce((sum, amount) => sum + amount, 0)
      
      if (monthTotal > 0) {
        pdf.text(`${month}: ₹${monthTotal.toFixed(2)}`, 20, yPosition)
        yPosition += 8
        yearTotal += monthTotal
      }
    })
    
    yPosition += 10
    pdf.setFontSize(14)
    pdf.setTextColor(0, 255, 255)
    pdf.text(`Total Year Expense: ₹${yearTotal.toFixed(2)}`, 20, yPosition)
    
    // Category Breakdown
    yPosition += 20
    pdf.setFontSize(16)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Category Breakdown', 20, yPosition)
    yPosition += 15
    
    const categoryTotals = {}
    Object.values(yearData).forEach(monthData => {
      Object.entries(monthData).forEach(([category, amount]) => {
        categoryTotals[category] = (categoryTotals[category] || 0) + amount
      })
    })
    
    pdf.setFontSize(12)
    Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, amount]) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage()
          yPosition = 30
        }
        pdf.text(`${category}: ₹${amount.toFixed(2)}`, 20, yPosition)
        yPosition += 8
      })
    
    // Try to capture charts
    try {
      const chartElements = document.querySelectorAll('.chart-container canvas')
      
      if (chartElements.length > 0) {
        pdf.addPage()
        pdf.setFontSize(16)
        pdf.text('Charts & Analytics', pageWidth / 2, 30, { align: 'center' })
        
        let chartY = 50
        for (let i = 0; i < Math.min(chartElements.length, 4); i++) {
          const canvas = chartElements[i]
          const chartTitle = canvas.closest('.chart-card')?.querySelector('.card-title')?.textContent || `Chart ${i + 1}`
          
          try {
            const chartCanvas = await html2canvas(canvas, {
              backgroundColor: '#1a1a2e',
              scale: 1
            })
            
            const imgData = chartCanvas.toDataURL('image/png')
            const imgWidth = 80
            const imgHeight = 60
            
            if (i % 2 === 0 && i > 0) {
              pdf.addPage()
              chartY = 50
            }
            
            const xPos = i % 2 === 0 ? 20 : pageWidth - imgWidth - 20
            
            pdf.setFontSize(12)
            pdf.text(chartTitle, xPos + imgWidth / 2, chartY - 5, { align: 'center' })
            pdf.addImage(imgData, 'PNG', xPos, chartY, imgWidth, imgHeight)
            
            if (i % 2 === 1) {
              chartY += imgHeight + 20
            }
          } catch (chartError) {
            console.warn('Could not capture chart:', chartError)
          }
        }
      }
    } catch (chartError) {
      console.warn('Could not capture charts:', chartError)
    }
    
    pdf.save(`BudgetPro-Report-${currentYear}.pdf`)
    showNotification('PDF report exported successfully!', 'success')
    
  } catch (error) {
    console.error('PDF export error:', error)
    showNotification('Failed to export PDF report', 'error')
  }
}
