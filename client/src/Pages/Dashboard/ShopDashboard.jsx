import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Store, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShopDashboard = () => {
  const { user, logout } = useAuth();
  console.log(user)
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  // Extract subdomain from the URL
  const subdomain = window.location.hostname.split('.')[0];
  const shopName = subdomain.replace(/-/g, ' ');

  useEffect(() => {
    // Fetch shop data based on subdomain
    const fetchShopData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shop/${shopName}`, {
          headers: {
            Authorization: `Bearer ${user.token}`, 
          },
        });
        if (!response.ok) throw new Error('Shop not found');
        const data = await response.json();
        setShopData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (user) {
      fetchShopData();
    }
  }, [user, subdomain]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setShowLogoutConfirm(false);
  };

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
  );

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">{error}</div>;

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
                {shopData?.name} Dashboard
              </h1>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span>{user?.username}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10 border">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">Signed in as</p>
                    <p className="text-sm text-gray-500">{user?.username}</p>
                  </div>
                  <div className="border-t flex justify-end">
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
      <main className="w-full lg:max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to {shopData?.name}!
          </h2>
          <p className="text-gray-600">Manage your shop's details below</p>
        </div>

        {/* Shop Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Shop Details</h3>
          <p className="text-sm text-gray-600 mb-2"><strong>Name:</strong> {shopData?.name}</p>
          <p className="text-sm text-gray-600 mb-2"><strong>Description:</strong> {shopData?.description || 'No description available'}</p>
          <p className="text-sm text-gray-600 mb-2"><strong>Products:</strong> {shopData?.products?.length || 0}</p>
          {/* Add more shop-specific details or widgets here */}
        </div>
      </main>

      {showLogoutConfirm && <LogoutConfirmModal />}
    </div>
  );
};

export default ShopDashboard;