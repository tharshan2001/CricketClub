import { useState } from 'react';
import { 
  FaPlus, 
  FaHome, 
  FaTrophy, 
  FaUsers,
  FaSignOutAlt 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GiCricketBat } from 'react-icons/gi';
import { MdSportsCricket } from 'react-icons/md';


const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/logout`,
        {},
        { withCredentials: true }
      );
      toast.success('Logged out successfully');
      navigate('/login'); // Redirect to login page after logout
    } catch (err) {
      toast.error(err.response?.data?.message || 'Logout failed');
    }
  };

return (
  <div className="fixed top-22 right-3 z-50">
    {/* Main FAB button */}
    <button
      onClick={toggleMenu}
      className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
    >
      <GiCricketBat 
        className={`w-6 h-6 text-white transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
      />
    </button>

    {/* Menu items open to left */}
    <div
      className={`absolute right-16 bottom-0 mb-2 flex space-x-2 transition-all duration-200 ${
        isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
      }`}
    >
      {/* Tournament Button */}
      <button 
        className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200"
        onClick={() => { 
          navigate('/tournament'); 
          setIsOpen(false);
        }}
      >
        <FaTrophy className="w-5 h-5 text-white" />
        <span className="sr-only">Tournament</span>
      </button>

      {/* Match Button */}
      <button 
        className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200"
        onClick={() => { 
          navigate('/match'); 
          setIsOpen(false);
        }}
      >
        <MdSportsCricket className="w-5 h-5 text-white" />
        <span className="sr-only">Match</span>
      </button>

      {/* Player Button */}
      <button 
        className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200"
        onClick={() => { 
          navigate('/player'); 
          setIsOpen(false);
        }}
      >
        <FaUsers className="w-5 h-5 text-white" />
        <span className="sr-only">Player</span>
      </button>

      {/* Logout Button */}
      <button 
        onClick={() => {
          handleLogout();
          setIsOpen(false);
        }}
        className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-full shadow-md hover:bg-red-600 transition-colors duration-200"
      >
        <FaSignOutAlt className="w-5 h-5 text-white" />
        <span className="sr-only">Logout</span>
      </button>
    </div>
  </div>
);

};

export default FloatingActionButton;
