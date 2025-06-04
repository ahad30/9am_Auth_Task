import React, { useState } from 'react'
import { User, Store, LogOut, ChevronDown, Plus, Eye } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [showProfile, setShowProfile] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const navigate = useNavigate()

const handleShopClick = (shopName) => {
  const token = localStorage.getItem('token') || 
               document.cookie.split('; ')
                .find(row => row.startsWith('token='))
                ?.split('=')[1];

  const userData = JSON.parse(localStorage.getItem('user'));

  if (!token || !userData) {
    console.error('No authentication data found');
    return;
  }

  const name = shopName.toLowerCase().replace(/\s+/g, '-');

  // Create the Verify URL
  const shopUrl = new URL(`http://${name}.${import.meta.env.VITE_FRONTEND_URL}?shop=${name}&token=${token}&userId=${userData.id}&username=${userData.username}&name=${name}`);


  window.open(shopUrl.toString(), '_blank');
  // window.location.href = shopUrl.toString();
};
   

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    setShowLogoutConfirm(false)
  }

  const LogoutConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <LogOut className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Confirm Logout
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to log out? You'll need to sign in again to access your account.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full lg:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <h1 className="ml-3 text-sm lg:text-xl font-semibold text-gray-900">
                Dashboard
              </h1>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span>{user?.username}</span>
                {
                  showProfile ? (
                    <ChevronDown className="h-4 w-4 text-gray-500 transform rotate-180" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )
                  }    
                
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10 border">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">Signed in as</p>
                    <p className="text-sm text-gray-500">{user?.username}</p>
                  </div>
                  
                  
                  <div className="border-t">
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="inline h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full lg:max-w-7xl mx-auto  sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.username}!</h2>
          <p className="text-gray-600">Manage your online stores from one dashboard</p>
        </div>

        {/* Shops Grid */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Your Shops ({user?.shops?.length})</h3>

            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user?.shops?.map((shop) => (
                <div key={shop.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                   
                
                  </div>
                  <p className="text-sm text-gray-500 mb-4 uppercase font-bold">
                    {shop.name}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleShopClick(shop.name)}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && <LogoutConfirmModal />}
    </div>
  )
}

export default Dashboard