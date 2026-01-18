export const showNotification = (message, type = 'success') => {
  // Remove existing notification
  const existing = document.querySelector('.notification')
  if (existing) {
    existing.remove()
  }

  const notification = document.createElement('div')
  notification.className = `notification ${type}`
  notification.textContent = message
  
  document.body.appendChild(notification)
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 3000)
}
