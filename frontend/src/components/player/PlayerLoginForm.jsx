import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:6030/';

const PlayerLoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);
  try {
    const response = await axios.post(`${BACKEND_URL}/api/players/login`, {
      email: formData.email,
      password: formData.password
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    toast.success('Login successful!');
    
    // Navigate to home page and reload
    setTimeout(() => {
      navigate('/');
      window.location.reload(); // Force page reload
    }, 1000);
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                       error.response?.data?.error || 
                       'Login failed. Please try again.';
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto mt-30 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-semibold mb-2 text-center text-gray-800">Player Login</h2>
      <p className="text-sm text-center text-gray-600 mb-6">
        Enter your credentials to access your account
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="text-center">
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Forgot Password?
          </button>
        </div>

        <div className="text-center text-sm">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/auth')}
            className="text-blue-600 hover:text-blue-800"
          >
            Register here
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerLoginForm;