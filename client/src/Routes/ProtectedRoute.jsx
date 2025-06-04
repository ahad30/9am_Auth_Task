import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const { loading , checkAuthStatus} = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);


  const getToken = () => {
    
    const query = new URLSearchParams(location.search);
    const urlToken = query.get('token');
    const cookieToken = Cookies.get('token');
    const localStorageToken = localStorage.getItem('token');
    
    return urlToken || cookieToken || localStorageToken;
  };

      useEffect(() => {
    const verifyAuth = async () => {
      await checkAuthStatus();
      setIsVerifying(false);
    };
    verifyAuth();
  }, []);
 

  useEffect(() => {
    // If token comes from URL, store it properly
    const query = new URLSearchParams(location.search);
    const urlToken = query.get('token');
    const userId = query.get('userId');
    const username = query.get('username');
    const name = query.get('name');

    if (urlToken && userId && username && name) {
      const user = {
        id: userId,
        username,
        shop: { name },
      };
      
      // Store in both cookie and localStorage
      Cookies.set('token', urlToken, { expires: 1 });
      Cookies.set('user', JSON.stringify(user), { expires: 1 });
      
      // Clean the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    setIsVerifying(false);
  }, [location]);



  if (loading || isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!getToken()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;