import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnvVar.js';

//Lazy-Load the transporter
let transporter;
function getTransporter() {
  if (!transporter) {
    if (!process.env.SMTP_HOST) {
      throw new Error('SMTP not configured');
    }
    transporter = nodemailer.createTransport({
      host: getEnvVar('SMTP_HOST'),
      port: Number(getEnvVar('SMTP_PORT')),
      auth: {
        user: getEnvVar('SMTP_USER'),
        pass: getEnvVar('SMTP_PASSWORD'),
      },
    });
  }
  return transporter;
}

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: getEnvVar('SMTP_FROM'),
    to,
    subject,
    html,
  });
};
