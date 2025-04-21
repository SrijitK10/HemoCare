import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

const DataChecker = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkData = async () => {
    setLoading(true);
    setError(null);
    try {
      const collectionNames = ['appointments', 'emergency_blood_requests'];
      const results = {};

      for (const collectionName of collectionNames) {
        const snapshot = await getDocs(collection(db, collectionName));
        const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const missingEmails = records.filter(record => !record.email || record.email.trim() === '');
        const invalidEmails = records.filter(record => {
          if (!record.email) return false;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return !emailRegex.test(record.email);
        });
        
        results[collectionName] = {
          totalRecords: records.length,
          missingEmails: missingEmails.length,
          invalidEmails: invalidEmails.length,
          missingEmailsList: missingEmails.map(r => ({ id: r.id, name: r.name || r.patientName || 'Unknown' })),
          invalidEmailsList: invalidEmails.map(r => ({ id: r.id, email: r.email }))
        };
      }
      
      setResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mx-auto max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4">Database Data Quality Checker</h2>
      <p className="mb-4 text-gray-600">
        Use this tool to check for missing or invalid email addresses in your database records.
      </p>

      <button
        onClick={checkData}
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 mb-6"
      >
        {loading ? 'Checking data...' : 'Check Database Records'}
      </button>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {results && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Check Results</h3>
          
          {Object.entries(results).map(([collection, data]) => (
            <div key={collection} className="border rounded-md p-4 mb-4">
              <h4 className="text-md font-medium mb-2">
                {collection === 'appointments' ? 'Donation Appointments' : 'Emergency Blood Requests'}
              </h4>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Total records: {data.totalRecords}</p>
                <p className="text-sm text-gray-600">Records with missing emails: {data.missingEmails}</p>
                <p className="text-sm text-gray-600">Records with invalid emails: {data.invalidEmails}</p>
              </div>

              {data.missingEmailsList.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-red-600 mb-2">Records missing email addresses:</h5>
                  <div className="bg-gray-50 p-2 rounded text-xs max-h-40 overflow-y-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left px-2 py-1">ID</th>
                          <th className="text-left px-2 py-1">Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.missingEmailsList.map(item => (
                          <tr key={item.id}>
                            <td className="px-2 py-1">{item.id.substring(0, 8)}...</td>
                            <td className="px-2 py-1">{item.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {data.invalidEmailsList.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-orange-600 mb-2">Records with invalid email addresses:</h5>
                  <div className="bg-gray-50 p-2 rounded text-xs max-h-40 overflow-y-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left px-2 py-1">ID</th>
                          <th className="text-left px-2 py-1">Invalid Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.invalidEmailsList.map(item => (
                          <tr key={item.id}>
                            <td className="px-2 py-1">{item.id.substring(0, 8)}...</td>
                            <td className="px-2 py-1">{item.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-gray-800">Recommendations</h3>
        <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
          <li>Make email fields required in your forms</li>
          <li>Add email validation to your forms</li>
          <li>Consider adding a default admin email for notifications when user email is missing</li>
          <li>For existing records with missing emails, consider updating them manually</li>
        </ul>
      </div>
    </div>
  );
};

export default DataChecker; 