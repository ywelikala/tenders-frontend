import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ConnectionStatus from './ConnectionStatus';

const Navigation = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will be handled by the page reload in the logout function
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Lanka Tender" className="h-12 w-auto" />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <ConnectionStatus className="mr-6" />
            <Link
              to="/"
              className={`text-gray-600 hover:text-tender-blue transition-colors text-sm font-medium ${
                isActive('/') ? 'text-tender-blue border-b-2 border-tender-blue pb-4' : ''
              }`}
            >
              Home
            </Link>
            
            {/* Show different tender link based on user role */}
            {isAuthenticated && user?.role === 'supplier' ? (
              <Link
                to="/supplier/dashboard"
                className={`text-gray-600 hover:text-tender-blue transition-colors text-sm font-medium ${
                  isActive('/supplier/dashboard') ? 'text-tender-blue border-b-2 border-tender-blue pb-4' : ''
                }`}
              >
                My Tenders
              </Link>
            ) : (
              <Link
                to="/tenders"
                className={`text-gray-600 hover:text-tender-blue transition-colors text-sm font-medium ${
                  isActive('/tenders') ? 'text-tender-blue border-b-2 border-tender-blue pb-4' : ''
                }`}
              >
                Tenders
              </Link>
            )}
            
            <Link
              to="/pricing"
              className={`text-gray-600 hover:text-tender-blue transition-colors text-sm font-medium ${
                isActive('/pricing') ? 'text-tender-blue border-b-2 border-tender-blue pb-4' : ''
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className={`text-gray-600 hover:text-tender-blue transition-colors text-sm font-medium ${
                isActive('/about') ? 'text-tender-blue border-b-2 border-tender-blue pb-4' : ''
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`text-gray-600 hover:text-tender-blue transition-colors text-sm font-medium ${
                isActive('/contact') ? 'text-tender-blue border-b-2 border-tender-blue pb-4' : ''
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="text-sm text-gray-600 hidden sm:block">
                  Welcome, {user?.firstName} {user?.lastName}
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  asChild
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <Link to="/register">Sign up</Link>
                </Button>
                <Button 
                  className="bg-tender-blue hover:bg-tender-blue-hover text-white"
                  asChild
                >
                  <Link to="/login">Sign in</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;