import { getEnvVar } from './getEnvVar.js';

// Brevo (Sendinblue) REST API endpoint for sending transactional emails
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

/**
 * Send an email using Brevo REST API
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content of the email
 */
export const sendEmail = async ({ to, subject, html }) => {
  // Step 1: Get the API key from environment variables
  const apiKey = getEnvVar('BREVO_API_KEY');
  const senderEmail = getEnvVar('BREVO_SENDER_EMAIL');
  const senderName = getEnvVar('BREVO_SENDER_NAME', 'NoteHubApp');

  // Step 2: Prepare the request body for Brevo API
  const emailData = {
    sender: {
      name: senderName,
      email: senderEmail,
    },
    to: [{ email: to }],
    subject: subject,
    htmlContent: html,
  };

  // Step 3: Send the HTTP request to Brevo API
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });

  // Step 4: Check if the request was successful
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message || `Brevo API error: ${response.status}`;
    throw new Error(errorMessage);
  }
};
