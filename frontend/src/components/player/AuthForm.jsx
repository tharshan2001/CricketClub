import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:6030/';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = email step, 2 = OTP step
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/temp/send-otp`, { email }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success(res.data.message);
      setStep(2); // Move to OTP verification step
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Something went wrong. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/temp/verify-otp`, { email, otp }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success(res.data.message);
      // Wait for 2 seconds before navigating to registration with email state
      setTimeout(() => navigate('/register', { 
        state: { 
          verifiedEmail: email,
          verificationSuccess: true 
        } 
      }), 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Invalid OTP or something went wrong. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-40 p-6 bg-white shadow-xl rounded-2xl">
      {step === 1 ? (
        <>
          <h2 className="text-2xl font-semibold mb-2 text-center text-gray-800">Join With Us</h2>
          <p className="text-sm text-center text-gray-600 mb-6">
            Enter your email to get started. We'll send you a one-time code to verify your identity.
          </p>
          <form onSubmit={handleSendOtp} className="space-y-4">
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
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-2 text-center text-gray-800">Verify Your Email</h2>
          <p className="text-sm text-center text-gray-600 mb-6">
            We've sent a 6-digit code to {email}. Please enter it below to verify your email.
          </p>
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              pattern="\d{6}"
              title="Please enter a 6-digit code"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-blue-600 py-2 rounded-xl hover:text-blue-700 transition"
            >
              Change Email
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AuthForm;