import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:6030/';

const PlayerRegistrationForm = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: location.state?.verifiedEmail || '',
    password: '',
    confirmPassword: '',
    preferredRole: '',
    battingStyle: '',
    bowlingStyle: [],
    experience: '',
    confirmInfo: false,
    agreeRules: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  // Disable email field if it came from verification
  const [emailDisabled] = useState(!!location.state?.verifiedEmail);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'bowlingStyle') {
      setFormData((prev) => {
        const updated = checked
          ? [...prev.bowlingStyle, value]
          : prev.bowlingStyle.filter((s) => s !== value);
        return { ...prev, bowlingStyle: updated };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  const validateStep1 = () => {
    const requiredFields = ['fullName', 'dateOfBirth', 'gender', 'phone', 'email', 'password', 'confirmPassword'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error('Fill all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    // Validate age (minimum 10 years)
    if (formData.dateOfBirth) {
      const age = calculateAge(formData.dateOfBirth);
      if (age < 10) {
        toast.error('Minimum age: 10 years');
        return false;
      }
    }

    // Validate password strength
    if (!validatePassword(formData.password)) {
      toast.error('Weak password');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Invalid email');
      return false;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Invalid phone number');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!formData.preferredRole || !formData.battingStyle || !formData.experience) {
      toast.error('Fill all required fields');
      return false;
    }
    if (!formData.confirmInfo || !formData.agreeRules) {
      toast.error('Confirm info and agree to rules');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/players/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Registration successful!');
        // Reset form after successful submission
        setFormData({
          fullName: '',
          dateOfBirth: '',
          gender: '',
          phone: '',
          email: '',
          password: '',
          confirmPassword: '',
          preferredRole: '',
          battingStyle: '',
          bowlingStyle: [],
          experience: '',
          confirmInfo: false,
          agreeRules: false,
        });
        setCurrentStep(1);
        // Navigate to home page after 2 seconds
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl mt-20">
      <h2 className="text-2xl font-semibold mb-2 text-center text-gray-800">Player Registration</h2>
      <p className="text-sm text-center text-gray-600 mb-6">
        {currentStep === 1 ? 'Enter your personal details' : 'Tell us about your cricket skills'}
      </p>

      {/* Step indicator */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            1
          </div>
          <div className={`w-12 h-1 ${currentStep === 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            2
          </div>
        </div>
      </div>

      {currentStep === 1 ? (
        <form className="space-y-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <input 
              type="text" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              placeholder="Full Name *" 
              required 
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />

            <div>
              <input 
                type="date" 
                name="dateOfBirth" 
                value={formData.dateOfBirth} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 10)).toISOString().split('T')[0]}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum age: 10 years</p>
            </div>

            <div className="flex gap-4 justify-center">
              {['Male', 'Female', 'Other'].map(g => (
                <label key={g} className="flex items-center">
                  <input 
                    type="radio" 
                    name="gender" 
                    value={g} 
                    checked={formData.gender === g} 
                    onChange={handleChange} 
                    required 
                    className="mr-2"
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>

            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="Phone Number *" 
              required 
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
              pattern="[0-9]{10,15}"
              title="10-15 digit phone number"
            />

            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Email Address *" 
              required 
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
              disabled={emailDisabled}
            />

            <div>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Password *" 
                required 
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <p className="text-xs text-gray-500 mt-1">
                Must contain: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
              </p>
            </div>

            <div>
              <input 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                placeholder="Confirm Password *" 
                required 
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>

          <button 
            type="button"
            onClick={handleNext}
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Next: Cricket Skills
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cricket Skills */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Preferred Role *</p>
              <div className="grid grid-cols-2 gap-2">
                {['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'].map(role => (
                  <label key={role} className="flex items-center">
                    <input 
                      type="radio" 
                      name="preferredRole" 
                      value={role} 
                      checked={formData.preferredRole === role} 
                      onChange={handleChange} 
                      required 
                      className="mr-2"
                    />
                    <span>{role}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Batting Style *</p>
              <div className="flex gap-4">
                {['Right', 'Left'].map(style => (
                  <label key={style} className="flex items-center">
                    <input 
                      type="radio" 
                      name="battingStyle" 
                      value={style} 
                      checked={formData.battingStyle === style} 
                      onChange={handleChange} 
                      required 
                      className="mr-2"
                    />
                    <span>{style}-handed</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Bowling Style (select all that apply)</p>
              <div className="grid grid-cols-2 gap-2">
                {['Fast', 'Medium', 'Spin', 'Left-arm', 'Right-arm'].map(style => (
                  <label key={style} className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="bowlingStyle" 
                      value={style} 
                      checked={formData.bowlingStyle.includes(style)} 
                      onChange={handleChange} 
                      className="mr-2"
                    />
                    <span>{style}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Experience Level *</p>
              <select 
                name="experience" 
                value={formData.experience} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Experience Level</option>
                {['Beginner', 'Intermediate', 'Advanced', 'Professional'].map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Agreements */}
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                name="confirmInfo" 
                checked={formData.confirmInfo} 
                onChange={handleChange} 
                required 
                className="mr-2"
              />
              <span>I confirm the above information is correct *</span>
            </label>

            <label className="flex items-center">
              <input 
                type="checkbox" 
                name="agreeRules" 
                checked={formData.agreeRules} 
                onChange={handleChange} 
                required 
                className="mr-2"
              />
              <span>I agree to follow club rules *</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={handleBack}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-xl hover:bg-gray-300 transition"
            >
              Back
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PlayerRegistrationForm;