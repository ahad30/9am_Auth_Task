import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Dashboard from "../Pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import ShopDashboard from "../Pages/Dashboard/ShopDashboard";


export const routes = createBrowserRouter([

      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: (
          <ProtectedRoute>
            <ShopDashboard />
         </ProtectedRoute>
        ),
      },
]);
