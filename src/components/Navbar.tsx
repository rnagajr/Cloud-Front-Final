import { ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          Car Rentals
        </Link>

        <nav className="space-x-4">
          <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          <Link to="/cars" className="text-gray-600 hover:text-gray-900">Cars</Link>
          <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact Us</Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900">About Us</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>

          {isAuthenticated ? (
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
