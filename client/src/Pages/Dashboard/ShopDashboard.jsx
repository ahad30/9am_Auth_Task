import { Loader2 } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';


const ShopDashboard = () => {
  const shopUserData = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
  // console.log(shopUserData)
  const shopName = shopUserData ? shopUserData?.shop?.name : "";
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;


  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-xl shadow-md p-6 md:p-8'>
          <h1 className='uppercase font-bold text-2xl md:text-3xl text-gray-800 mb-4'>
            {shopName ? (
              `Welcome to ${shopName} Dashboard`
            ) : (
              <div className='space-y-4'>
                <p className='text-gray-700'>Welcome to Multiple Shop Dashboard Management</p>
                {!user && (
                  <Link 
                    to="/login" 
                    className='inline-flex items-center justify-center gap-2 text-white hover:bg-blue-600 bg-blue-500 py-2 px-6 rounded-lg transition-colors duration-200'
                  >
                    <span className='text-base font-medium'>Login to manage your shops</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </Link>
                )}
              </div>
            )}
          </h1>
          

          {user && !shopName && (
            <div className='mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4'>
             <p>You are logged in as {user.username}</p>
              <h2 className='text-lg font-medium text-blue-800 mb-2'>
                Go to your shop dashboard to manage your shops.
              </h2>
             <Link to="/dashboard" className='inline-flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800'>
              
               <button className='text-white bg-green-500 hover:bg-green-600 py-2 px-4 rounded-lg'>Go to Dashboard</button>
             </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;