import emailjs from '@emailjs/browser';

// Initialize EmailJS with your user ID from environment variables
const initEmailJS = () => {
  // Use the public key from environment variables
  emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY2);
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
export const sendStatusUpdateEmail = async (recipientEmail, recipientName, requestType, status, requestDetails) => {
  console.log('Starting email notification process:', {
    recipientEmail,
    recipientName,
    requestType,
    status,
    requestDetails,
    emailType: typeof recipientEmail,
    emailLength: recipientEmail?.length,
    emailTrimmed: recipientEmail?.trim(),
    emailValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)
  });

  // Validate email
  if (!recipientEmail) {
    console.warn('Email notification skipped: No email provided');
    return { skipped: true, reason: 'No email provided' };
  }

  const trimmedEmail = recipientEmail.trim();
  if (!trimmedEmail) {
    console.warn('Email notification skipped: Email is empty after trimming');
    return { skipped: true, reason: 'Email is empty after trimming' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    console.warn('Email notification skipped: Invalid email format', { email: trimmedEmail });
    return { skipped: true, reason: 'Invalid email format' };
  }

  try {
    // Initialize EmailJS if not already initialized
    if (!emailjs.userID) {
      console.log('Initializing EmailJS with public key:', import.meta.env.VITE_EMAILJS_PUBLIC_KEY2);
      emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY2);
    }

    // Prepare template params
    const templateParams = {
      to_email: trimmedEmail,
      to_name: recipientName || 'User',
      from_name: 'HemoCare Blood Donation Center',
      subject: `HemoCare: Your ${requestType} request has been ${status}`,
      request_type: requestType,
      status: status,
      request_id: requestDetails.id || '',
      blood_type: requestDetails.bloodType || 'Not specified',
      message: getStatusMessage(requestType, status, requestDetails),
    };

    console.log('Attempting to send email with configuration:', {
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID2,
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID2,
      templateParams: {
        ...templateParams,
        to_email: '[REDACTED]', // For security in logs
      }
    });

    // Send the email
    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID2,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID2,
      templateParams
    );
    
    console.log('Email sent successfully:', {
      status: result.status,
      text: result.text,
      email: '[REDACTED]' // For security in logs
    });
    
    return result;
  } catch (error) {
    console.error('Failed to send email notification:', {
      error: error.message,
      errorText: error.text,
      errorStatus: error.status,
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID2,
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID2,
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY2?.substring(0, 3) + '...',
      email: '[REDACTED]' // For security in logs
    });
    
    // Return a more detailed error object
    return {
      error: true,
      message: error.message,
      status: error.status,
      text: error.text,
      details: {
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID2,
        templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID2
      }
    };
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
      return `Your blood donation appointment has been approved for ${date} at ${time}. You will be donating blood type ${bloodType}. Thank you for your willingness to donate!`;
    } else if (status === 'rejected') {
      return `We regret to inform you that your blood donation appointment for ${date} at ${time} could not be accommodated. Please try scheduling for a different date/time.`;
    }
  } else if (requestType === 'emergency') {
    if (status === 'approved') {
      return `Your emergency blood request for blood type ${bloodType} has been approved. Please contact our center for further details.`;
    } else if (status === 'rejected') {
      return `We regret to inform you that your emergency blood request for blood type ${bloodType} could not be fulfilled at this time. Please contact our center for assistance with alternatives.`;
    }
  }
  
  return `The status of your ${requestType} request for blood type ${bloodType} has been updated to "${status}".`;
};

// Initialize EmailJS
initEmailJS();

export default { sendStatusUpdateEmail }; 