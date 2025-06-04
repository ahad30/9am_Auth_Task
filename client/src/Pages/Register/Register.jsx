import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Plus, X, Store } from 'lucide-react'
import {toast} from 'sonner'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    shopNames: ['', '', '']
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleShopNameChange = (index, value) => {
    const updatedShopNames = [...formData.shopNames]
    updatedShopNames[index] = value
    setFormData(prev => ({
      ...prev,
      shopNames: updatedShopNames
    }))
  }

  const addShopField = () => {
    if (formData?.shopNames) {
      setFormData(prev => ({
        ...prev,
        shopNames: [...prev.shopNames, '']
      }))
    }
  }

  const removeShopField = (index) => {
    if (formData.shopNames.length > 3) {
      const updatedShopNames = formData.shopNames.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        shopNames: updatedShopNames
      }))
    }
  }

  const validateForm = () => {
    const { username, password, shopNames } = formData

    if (!username.trim()) {
      toast.error('Username is required')
      return false
    }

    if (username.length < 3) {
      toast.error('Username must be at least 3 characters')
      return false
    }

    if (!password) {
      toast.error('Password is required')
      return false
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return false
    }

    if (!/(?=.*[0-9])/.test(password)) {
      toast.error('Password must contain at least one number')
      return false
    }

    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      toast.error('Password must contain at least one special character')
      return false
    }

    const validShopNames = shopNames.filter(name => name.trim())
    if (validShopNames.length < 3) {
      toast.error('You must provide at least 3 shop names')
      return false
    }

    const uniqueNames = new Set(validShopNames.map(name => name.toLowerCase().trim()))
    if (uniqueNames.size !== validShopNames.length) {
      toast.error('Shop names must be unique')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
    const validShopNames = formData.shopNames
      .filter(name => name.trim())
      .map(name => name.trim())

    const result = await signup({
      username: formData.username.trim(),
      password: formData.password,
      shopNames: validShopNames
    })

    if (result.success) {
      navigate('/login')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full lg:max-w-xl mx-auto flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 rounded-lg">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
         
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 underline"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-start text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                
                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 form-input"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-start text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be 8+ characters with at least one number and special character
              </p>
            </div>

            {/* Shop Names */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Names (minimum 3 required)
              </label>
              <div className="space-y-2">
                {formData.shopNames.map((shopName, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 form-input"
                      placeholder={`Shop name ${index + 1}`}
                      value={shopName}
                      onChange={(e) => handleShopNameChange(index, e.target.value)}
                    />
                    {formData.shopNames.length > 3 && (
                      <button
                        type="button"
                        onClick={() => removeShopField(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {formData?.shopNames && (
               <div className='flex justify-end'>
                 <button
                  type="button"
                  onClick={addShopField}
                  className="mt-2 flex items-center px-2 py-1 rounded-md space-x-1 text-sm bg-green-500 text-white uppercase"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add more shop</span>
                </button>
               </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border bg-blue-500 border-transparent rounded-md shadow-sm text-sm font-medium text-white  disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register