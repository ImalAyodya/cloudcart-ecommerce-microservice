import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Header() {
  const { isAuthenticated, user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl font-bold text-indigo-600">CloudCart</h1>
          </Link>

          <nav className="flex gap-8 text-gray-600 font-medium">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <Link to="/products" className="hover:text-indigo-600 transition">Products</Link>
            <Link to="/about" className="hover:text-indigo-600 transition">About</Link>
            <Link to="/contact" className="hover:text-indigo-600 transition">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Welcome, <span className="font-semibold text-indigo-600">{user?.name || user?.email}</span></span>
                <Link to="/profile" className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-600 font-medium hover:bg-indigo-200 transition">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-100 text-red-600 font-medium hover:bg-red-200 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
