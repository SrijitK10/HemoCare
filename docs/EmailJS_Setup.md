# Setting Up EmailJS for HemoCare Notifications

This guide explains how to set up EmailJS to enable email notifications when request statuses change in the HemoCare admin dashboard.

## Create an EmailJS Account

1. Sign up for a free account at [EmailJS.com](https://www.emailjs.com/)
2. The free tier allows 200 emails per month, which should be sufficient for testing and low-volume use.

## Setting Up Your Email Service

1. After signing in, go to the "Email Services" section.
2. Click "Add New Service" and choose your preferred email provider (Gmail, Outlook, etc.)
3. Follow the instructions to connect your email account.
4. Once connected, note down the **Service ID** - you'll need this for your environment variables.

## Creating Email Templates

1. Go to the "Email Templates" section.
2. Create two templates:
   - One for general notifications/emergency requests
   - One for donation appointment notifications
3. Design your templates with the following dynamic variables:
   - `{{to_name}}` - Recipient's name
   - `{{to_email}}` - Recipient's email
   - `{{from_name}}` - Sender name (HemoCare Blood Donation Center)
   - `{{subject}}` - Email subject line
   - `{{request_type}}` - Type of request (appointment or emergency)
   - `{{status}}` - New status (approved or rejected)
   - `{{request_id}}` - ID of the request
   - `{{message}}` - The detailed status message

4. **IMPORTANT**: Make sure your template includes ALL the variables listed above. EmailJS requires all variables referenced in your code to exist in the template, even if you don't display them all.

Example template:
```html
<!DOCTYPE html>
<html>
<head>
    <title>HemoCare Status Update</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #e53e3e;">HemoCare</h1>
            <p style="font-size: 18px; color: #333;">Blood Donation Center</p>
        </div>
        
        <p>Dear {{to_name}},</p>
        
        <p>{{message}}</p>
        
        <p>Request ID: <strong>{{request_id}}</strong></p>
        <p>Request Type: <strong>{{request_type}}</strong></p>
        <p>Status: <strong>{{status}}</strong></p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #666;">
            <p>This is an automated notification from {{from_name}}.<br>
            Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
```

5. Save each template and note down their **Template IDs**.

## Configuring Environment Variables

The application uses environment variables to store EmailJS configuration. These are already set up in the `.env` file with the following variables:

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_general_template_id
VITE_EMAILJS_TEMPLATE_DONATE_ID=your_donation_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Update these values in the `.env` file to match your EmailJS account settings:

1. `VITE_EMAILJS_PUBLIC_KEY`: Your EmailJS Public Key (found in Account → API Keys)
2. `VITE_EMAILJS_SERVICE_ID`: The Service ID you created earlier
3. `VITE_EMAILJS_TEMPLATE_ID`: The Template ID for general/emergency notifications
4. `VITE_EMAILJS_TEMPLATE_DONATE_ID`: The Template ID for donation appointment notifications

## Testing the Email Configuration

We've included a testing utility to help verify that your EmailJS configuration is working correctly:

1. Navigate to the `/email-tester` route in the application (add this to your browser URL).
2. Enter a valid email address where you want to receive the test email.
3. Click "Send Test Email" and wait for the result.
4. The test will provide detailed information about any configuration issues.

If the test fails, check:
- Your environment variables are set correctly
- Your email template includes all required parameters
- Your email service is connected and active in EmailJS

## Testing in the Admin Dashboard

1. In the admin dashboard, approve or reject a request that has an email address associated with it.
2. The system should send an automated email notification to the user.
3. Check the EmailJS dashboard to see if the email was sent successfully.

## Troubleshooting

- If you see a 422 error (Unprocessable Entity), it typically means:
  - Your template parameters don't match what the template expects
  - Required fields are missing in your template parameters
  - Check that all variables sent in the code (`from_name`, `subject`, etc.) are defined in your email template

- Other common issues:
  - Verify that all environment variables are correctly set in the `.env` file.
  - Make sure the email address is valid and properly formatted.
  - Check your EmailJS dashboard to see if there are any delivery issues or quota limitations.
  - Try updating your template in EmailJS to include all the parameters sent from the code. 