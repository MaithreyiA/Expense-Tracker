import React, { useState } from 'react'

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.nickname) {
      newErrors.nickname = 'Nickname is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onLogin(formData)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">BudgetPro</h1>
          <p className="login-subtitle">Professional Expense Tracking</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
            />
            {errors.email && <span style={{ color: 'var(--accent-pink)', fontSize: '0.875rem' }}>{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Nickname</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your nickname"
            />
            {errors.nickname && <span style={{ color: 'var(--accent-pink)', fontSize: '0.875rem' }}>{errors.nickname}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password (min 8 characters)"
            />
            {errors.password && <span style={{ color: 'var(--accent-pink)', fontSize: '0.875rem' }}>{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary">
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
