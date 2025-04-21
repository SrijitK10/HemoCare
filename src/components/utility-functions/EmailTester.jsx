import React, { useState } from 'react';
import { testEmailNotification } from '../../firebase/notificationService';

const EmailTester = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    
    try {
      const result = await testEmailNotification(email);
      setStatus(result);
    } catch (error) {
      setStatus({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mx-auto max-w-md">
      <h2 className="text-2xl font-semibold mb-4">EmailJS Configuration Tester</h2>
      <p className="mb-4 text-gray-600">
        Use this tool to test if your EmailJS configuration is working correctly.
      </p>
      
      <form onSubmit={handleTest}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Test Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          {loading ? 'Sending Test Email...' : 'Send Test Email'}
        </button>
      </form>
      
      {status && (
        <div className={`mt-4 p-3 rounded-md ${status.success ? 'bg-green-50' : 'bg-red-50'}`}>
          <h3 className={`text-lg font-medium ${status.success ? 'text-green-800' : 'text-red-800'}`}>
            {status.success ? 'Test Successful' : 'Test Failed'}
          </h3>
          {status.success ? (
            <p className="text-green-700 mt-1">Email was sent successfully!</p>
          ) : (
            <div>
              <p className="text-red-700 mt-1">Error: {status.error}</p>
              {status.serviceId && (
                <div className="mt-2 text-sm text-red-700">
                  <p>Service ID: {status.serviceId}</p>
                  <p>Template ID: {status.templateId}</p>
                  <p>Public Key: {status.publicKey}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-gray-800">Troubleshooting</h3>
        <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
          <li>Make sure your .env file has the correct EmailJS keys</li>
          <li>Check that your EmailJS template includes all required parameters</li>
          <li>Verify your email service is properly connected in EmailJS</li>
          <li>Check browser console for more detailed error messages</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailTester; 