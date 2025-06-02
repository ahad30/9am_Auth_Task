import React, { useEffect, useState } from 'react'
import { Store, User, LogOut, Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const ShopDashboard = () => {
  const { user, loading, logout, currentShop, isSubdomain } = useAuth()
  const [shopData, setShopData] = useState(null)
  // const [shopLoading, setShopLoading] = useState(true)

  useEffect(() => {
    if (user && currentShop) {
      // Find the current shop data from user's shops
      const shop = user.shops?.find(s => 
        s.name.toLowerCase().replace(/\s+/g, '-') === currentShop
      )
      setShopData(shop)
      // setShopLoading(false)
    }
  }, [user, currentShop])

  const handleBackToDashboard = () => {
    window.location.href = 'http://localhost:5173/dashboard'
  }

  const handleLogout = async () => {
    await logout()
  }

  // if (loading || shopLoading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
  //         <p className="text-gray-600">Loading shop dashboard...</p>
  //       </div>
  //     </div>
  //   )
  // }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access this shop.</p>
          <button
            onClick={() => window.location.href = 'http://localhost:5173/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={handleBackToDashboard}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900 capitalize">
                {currentShop} Shop
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="h-8 w-8 text-blue-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4 capitalize">
            This is {currentShop} shop
          </h1>
          
          {shopData && (
            <div className="mb-6">
              <p className="text-lg text-gray-600 mb-2">
                Shop Name: <span className="font-medium">{shopData.name}</span>
              </p>
              <p className="text-sm text-gray-500">
                URL: {window.location.hostname}
              </p>
            </div>
          )}
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shop Dashboard</h3>
            <p className="text-gray-600 mb-4">
              Welcome to your {currentShop} shop dashboard. This is where you can manage your store.
            </p>
            

          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleBackToDashboard}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Main Dashboard
            </button>

          </div>
        </div>
      </main>
    </div>
  )
}

export default ShopDashboard