import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Home, User, LogOut, PlusCircle, Bookmark } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Home className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">stay.in</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 hidden sm:block">Hello, {user.username}</span>
                <Link
                  to="/bookings"
                  className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Bookmark className="h-4 w-4 mr-1" />
                  My Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-secondary px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <User className="h-4 w-4 mr-1" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
