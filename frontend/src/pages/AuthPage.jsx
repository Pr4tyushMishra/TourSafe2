import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDigitalID } from '../contexts/DigitalIDContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const { generateDigitalID } = useDigitalID();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    // Login fields
    email: '',
    password: '',
    // Registration fields
    fullName: '',
    nationality: 'Indian',
    passport: '', // Optional - for travelers
    phone: '',
    emergencyContact: '',
    tripDuration: '', // Optional - can be set later
    destination: '' // Optional - can be set when planning a trip
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycStep, setKycStep] = useState(0);
  const [kycData, setKycData] = useState({
    documentType: 'passport',
    documentNumber: '',
    documentPhoto: null,
    selfiePhoto: null,
    verified: false
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleKycChange = (e) => {
    setKycData({
      ...kycData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (field, file) => {
    setKycData({
      ...kycData,
      [field]: file
    });
  };

  const simulateLogin = async () => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful login
    localStorage.setItem('safeTourist_user', JSON.stringify({
      id: 'user_demo_123',
      email: formData.email,
      name: 'Alex Johnson',
      isAuthenticated: true,
      loginTime: new Date().toISOString()
    }));
    
    setIsSubmitting(false);
    navigate('/dashboard');
  };

  const simulateRegistration = async () => {
    if (kycStep < 3) {
      setKycStep(kycStep + 1);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate KYC verification delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create user account
      const userData = {
        id: `user_${Date.now()}`,
        ...formData,
        kycVerified: true,
        registeredAt: new Date().toISOString()
      };
      
      localStorage.setItem('safeTourist_user', JSON.stringify({
        ...userData,
        isAuthenticated: true
      }));
      
      // Generate initial digital ID only if travel info is provided
      let itinerary = [];
      if (formData.destination && formData.tripDuration) {
        itinerary = [{
          place: formData.destination || 'TBD',
          from: new Date().toISOString().split('T')[0],
          to: new Date(Date.now() + (formData.tripDuration || 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }];
        await generateDigitalID(userData, itinerary);
      }
      
      setIsSubmitting(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setIsSubmitting(false);
    }
  };

  const renderKycStep = () => {
    switch (kycStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Indian">Indian</option>
                  <option value="American">American</option>
                  <option value="British">British</option>
                  <option value="Canadian">Canadian</option>
                  <option value="Australian">Australian</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Document Verification</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
              <select
                name="documentType"
                value={kycData.documentType}
                onChange={handleKycChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="passport">Passport</option>
                <option value="driving_license">Driving License</option>
                <option value="national_id">National ID</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Number</label>
              <input
                type="text"
                name="documentNumber"
                value={kycData.documentNumber}
                onChange={handleKycChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter document number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Document Photo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('documentPhoto', e.target.files[0])}
                  className="hidden"
                  id="document-upload"
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </label>
                {kycData.documentPhoto && (
                  <p className="text-sm text-green-600 mt-2">✓ Document uploaded</p>
                )}
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Selfie Verification</h3>
            <p className="text-sm text-gray-600 text-center">
              Take a selfie to verify your identity matches your document
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                capture="user"
                onChange={(e) => handleFileUpload('selfiePhoto', e.target.files[0])}
                className="hidden"
                id="selfie-upload"
              />
              <label htmlFor="selfie-upload" className="cursor-pointer">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">Take Selfie</p>
              </label>
              {kycData.selfiePhoto && (
                <p className="text-sm text-green-600 mt-2">✓ Selfie captured</p>
              )}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center text-green-600">✓ Verification Complete</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Identity Verified</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Your documents have been verified successfully. You can now complete your registration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 flex items-center justify-center bg-blue-600 rounded-full">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21c-4.337-3.488-6.5-7.22-6.5-10.053C5.5 6.3 8.818 3 12 3s6.5 3.3 6.5 7.947C18.5 13.78 16.337 17.512 12 21z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to TourSafe' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your trusted travel safety companion
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {!isLogin && kycStep > 0 ? (
            <>
              {/* KYC Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Step {kycStep + 1} of 4</span>
                  <span>{Math.round(((kycStep + 1) / 4) * 100)}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((kycStep + 1) / 4) * 100}%` }}
                  ></div>
                </div>
              </div>

              {renderKycStep()}

              <div className="mt-6 flex space-x-3">
                {kycStep > 0 && (
                  <button
                    onClick={() => setKycStep(kycStep - 1)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={simulateRegistration}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Processing...' : kycStep === 3 ? 'Complete Registration' : 'Continue'}
                </button>
              </div>
            </>
          ) : (
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); isLogin ? simulateLogin() : setKycStep(1); }}>
              {isLogin ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  {/* Optional travel information */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-800 mb-3">Travel Information (Optional)</h4>
                    <p className="text-xs text-blue-600 mb-3">You can skip this and add travel details later in your profile</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                        <input
                          type="text"
                          name="passport"
                          value={formData.passport}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Optional - for travelers"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trip Duration (days)</label>
                        <input
                          type="number"
                          name="tripDuration"
                          value={formData.tripDuration}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                          max="365"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Start KYC Verification'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setKycStep(0);
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="text-center text-xs text-gray-500">
          <p>🔬 Demo Mode: This is a simulation for demonstration purposes</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;