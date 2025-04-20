import emailjs from '@emailjs/browser';

// Initialize EmailJS with your user ID from environment variables
const initEmailJS = () => {
  // Use the public key from environment variables
  emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
};

/**
 * Send a notification email when a request status changes
 * @param {string} email - Recipient's email address
 * @param {string} name - Recipient's name
 * @param {string} requestType - Type of request (appointment or emergency)
 * @param {string} status - New status (approved or rejected)
 * @param {object} requestDetails - Optional additional details about the request
 * @returns {Promise} - Promise resolving to the email send result
 */
export const sendStatusUpdateEmail = async (email, name, requestType, status, requestDetails = {}) => {
  if (!email) {
    console.error('Email address is required to send notifications');
    return;
  }

  try {
    // Prepare template params
    const templateParams = {
      to_email: email,
      to_name: name,
      request_type: requestType,
      status: status,
      request_id: requestDetails.id || '',
      message: getStatusMessage(requestType, status, requestDetails),
    };

    // Use service and template IDs from environment variables
    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      requestType === 'appointment' ? import.meta.env.VITE_EMAILJS_TEMPLATE_DONATE_ID : import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    );
    
    console.log('Email notification sent successfully:', result.text);
    return result;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    throw error;
  }
};

/**
 * Generate an appropriate message based on the request type and status
 */
const getStatusMessage = (requestType, status, details) => {
  const date = details.date || 'the requested date';
  const time = details.time || 'the scheduled time';
  const bloodType = details.bloodType || 'requested blood type';

  if (requestType === 'appointment') {
    if (status === 'approved') {
      return `Your blood donation appointment has been approved for ${date} at ${time}. Thank you for your willingness to donate!`;
    } else if (status === 'rejected') {
      return `We regret to inform you that your blood donation appointment for ${date} at ${time} could not be accommodated. Please try scheduling for a different date/time.`;
    }
  } else if (requestType === 'emergency') {
    if (status === 'approved') {
      return `Your emergency blood request for ${bloodType} has been approved. Please contact our center for further details.`;
    } else if (status === 'rejected') {
      return `We regret to inform you that your emergency blood request for ${bloodType} could not be fulfilled at this time. Please contact our center for assistance with alternatives.`;
    }
  }
  
  return `The status of your ${requestType} request has been updated to "${status}".`;
};

// Initialize EmailJS
initEmailJS();

export default { sendStatusUpdateEmail }; 