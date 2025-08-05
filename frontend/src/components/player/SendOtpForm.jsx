import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:6030/';

const SendOtpForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await axios.post(`${BACKEND_URL}api/temp/send-otp`, { email }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    toast.success(res.data.message);
    // Wait for 2 seconds before navigating
    setTimeout(() => navigate('/verify'), 2000);
  } catch (error) {
    toast.error(
      error.response?.data?.message || 'Something went wrong. Try again.'
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-semibold mb-2 text-center text-gray-800">Join With Us</h2>
      <p className="text-sm text-center text-gray-600 mb-6">
        Enter your email to get started. We'll send you a one-time code to verify your identity.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Sending...' : 'Get Started'}
        </button>
      </form>
    </div>
  );
};

export default SendOtpForm;