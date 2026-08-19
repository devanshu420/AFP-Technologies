import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create Transporter with explicit configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT, 10) || 465,
  secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT == '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Make sure this is a 16-digit Google App Password
  },
});

// Verify connection configuration on startup
transporter.verify((error) => {
  if (error) {
    console.error('❌ [NODEMAILER CONNECTION ERROR]:', error.message);
  } else {
    console.log('✅ [NODEMAILER READY]: Mail server connected successfully');
  }
});

// 1. Send Admin Notification
export async function sendAdminNotification({ name, email, phone, company, product, message }) {
  try {
    const mailOptions = {
      from: `"AFP Technologies Leads" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `🚨 New Lead: ${name} (${phone || 'No phone'})`,
      text: `New enquiry from ${name} (${email}, ${phone || 'N/A'})\n\nMessage: ${message || 'N/A'}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #071b32; color: #f8fafc; padding: 24px; border-radius: 10px;">
          <h2 style="color: #38bdf8; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-top: 0;">
            New Machinery Enquiry
          </h2>
          <p><strong>Client Name:</strong> ${name}</p>
          <p><strong>Work Email:</strong> <a href="mailto:${email}" style="color: #60a5fa;">${email}</a></p>
          <p><strong>Phone Number:</strong> ${phone ? `<a href="tel:${phone}" style="color: #34d399; font-weight: bold;">${phone}</a>` : '<span style="color: #94a3b8;">Not provided</span>'}</p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
          ${product ? `<p><strong>Requested Machine:</strong> ${product}</p>` : ''}
          
          <div style="margin-top: 18px; background: rgba(255,255,255,0.05); padding: 14px; border-radius: 6px; border-left: 3px solid #38bdf8;">
            <strong style="display: block; margin-bottom: 6px;">Message / Project Scope:</strong>
            <p style="color: #cbd5e1; margin: 0; white-space: pre-wrap;">${message || 'No additional message provided.'}</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [ADMIN EMAIL SENT]: Message ID: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error('❌ [ADMIN EMAIL FAILED]:', err.message);
    throw err;
  }
}

// 2. Send User Confirmation (Fixed From header & error throwing)
export async function sendUserConfirmation({ name, email }) {
  try {
    const cleanEmail = email.trim().toLowerCase();

    const mailOptions = {
      from: `"AFP Technologies Industries" <${process.env.SMTP_USER}>`,
      to: cleanEmail,
      replyTo: process.env.SMTP_USER,
      subject: `Thank you for contacting AFP Technologies Industries`,
      // 🟢 Yeh headers spam filter ko batate hain ki yeh automated bulk mail nahi hai
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
      },
      text: `Hello ${name},\n\nThank you for reaching out to AFP Technologies Industries. We have received your machinery enquiry.\n\nOur engineering and technical sales team will review your requirement and connect with you shortly.\n\nBest regards,\nAFP Technologies Industries Team`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #071b32; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 1.5rem; letter-spacing: 1px;">AFP Technologies<span style="color: #38bdf8;">.</span></h1>
          </div>
          <div style="padding: 24px;">
            <h2 style="color: #071b32; margin-top: 0;">Hello ${name},</h2>
            <p style="color: #475569; font-size: 15px;">
              Thank you for reaching out to <strong>AFP Technologies Industries</strong>. We have successfully received your enquiry.
            </p>
            <p style="color: #475569; font-size: 15px;">
              Our technical engineering team is reviewing your project requirements and will connect with you via phone or email shortly.
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">
              This is an automated confirmation from AFP Technologies Industries. If you did not make this request, please ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [USER EMAIL SENT]: To: ${cleanEmail} | Message ID: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ [USER EMAIL FAILED] To ${email}:`, err.message);
    throw err;
  }
}