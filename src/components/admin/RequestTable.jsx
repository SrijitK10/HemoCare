import React from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';

const RequestTable = ({ collectionName, title, columns }) => {
  const { 
    appointments,
    emergencyRequests,
    helpRequests,
    bloodDriveRequests,  // Add this line
    updateRequestStatus,
    deleteRequest,
    loading,
    error 
  } = useDatabase();

  const getRequests = () => {
    switch (collectionName) {
      case 'appointments':
        return appointments || [];
      case 'emergency_blood_requests':
        return emergencyRequests || [];
      case 'helpRequests':
        return helpRequests || [];
      case 'blood_drive_requests':  // Add this case
        return bloodDriveRequests || [];
      default:
        return [];
    }
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return '-';
    try {
      // The dateTime string is in format "DD/MM/YYYY HH:mm"
      const [datePart, timePart] = dateTimeString.split(' ');
      if (!datePart) return '-';
      
      // Parse the date part (format: DD/MM/YYYY)
      const [day, month, year] = datePart.split('/').map(Number);
      
      // Create a new date object (months are 0-based in JavaScript)
      const date = new Date(year, month - 1, day);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateTimeString);
        return '-';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    try {
      // Split the dateTime string into date and time parts
      const [datePart, timePart] = dateTimeString.split(' ');
      return timePart || '-';
    } catch (error) {
      console.error('Error formatting time:', error);
      return '-';
    }
  };

  const requests = getRequests();
  console.log('Sample request data:', requests[0]); // Add this line
  console.log('Collection Name:', collectionName);
  console.log('Blood Drive Requests:', bloodDriveRequests);
  console.log('Filtered Requests:', requests);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateRequestStatus(collectionName, id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await deleteRequest(collectionName, id);
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        </div>
        <div className="p-4 text-center text-gray-500">
          No requests found
        </div>
      </div>
    );
  }

  const formatFieldValue = (value, columnKey) => {
    if (!value) return '-';

    // Handle Firestore Timestamp objects
    if (value && typeof value === 'object' && 'seconds' in value) {
      const date = new Date(value.seconds * 1000);
      if (columnKey === 'time') {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    // Handle regular string dates
    if (columnKey === 'date' && typeof value === 'string') {
      return formatDate(value);
    }
    if (columnKey === 'time' && typeof value === 'string') {
      return formatTime(value);
    }

    // Return string value for other fields
    return String(value);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id}>
                {columns.map((column) => (
                  <td 
                    key={column.key} 
                    className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || 'text-gray-500'}`}
                  >
                    {formatFieldValue(request[column.key], column.key)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={request.status || 'pending'}
                    onChange={(e) => handleStatusChange(request.id, e.target.value)}
                    className="mr-2 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button
                    onClick={() => handleDelete(request.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestTable;