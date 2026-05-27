import nodemailer from 'nodemailer';

// Creates a transporter using environment variables.
// For testing without a real email server, we use Ethereal (a fake SMTP service).
const createTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  // If real credentials are set, use them
  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: { user, pass },
    });
  }

  // Otherwise, fall back to a test-mode logger (no email is actually sent)
  console.warn('[Mailer] No EMAIL credentials in .env. Emails will only be logged to console.');
  return nodemailer.createTransport({
    jsonTransport: true,
  });
};

const transporter = createTransporter();

export const sendWelcomeEmail = async (lead: {
  name: string;
  email?: string;
  phone: string;
  interest?: string;
}) => {
  if (!lead.email) {
    console.log(`[Mailer] Skipping welcome email for ${lead.name} — no email provided.`);
    return;
  }

  const mailOptions = {
    from: `"Moto Monk" <${process.env.EMAIL_USER || 'noreply@motomonk.com'}>`,
    to: lead.email,
    subject: `Welcome to Moto Monk, ${lead.name}! 🏍️`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Moto Monk</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border-radius:16px;border:1px solid #1f2937;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#f97316,#ea580c);padding:40px;text-align:center;">
              <h1 style="margin:0;font-size:32px;font-weight:800;letter-spacing:-1px;color:#ffffff;">MOTO MONK</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;letter-spacing:2px;text-transform:uppercase;">Next-Gen AI Lead Generation</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;font-size:22px;color:#ffffff;">Hey ${lead.name}, welcome aboard! 🎉</h2>
              <p style="margin:0 0 20px;color:#9ca3af;line-height:1.7;font-size:15px;">
                Thank you for reaching out to Moto Monk. We've received your enquiry and our team will get back to you shortly.
              </p>
              <p style="margin:0 0 30px;color:#9ca3af;line-height:1.7;font-size:15px;">
                In the meantime, our AI assistant is available 24/7 to answer any questions you might have about our motorcycles, pricing, or financing options.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 30px;">
                <tr>
                  <td style="background:#f97316;border-radius:12px;padding:14px 28px;">
                    <a href="http://localhost:3000" style="color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;">Chat with AI Assistant →</a>
                  </td>
                </tr>
              </table>

              <!-- Info box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border:1px solid #1f2937;border-radius:12px;margin-bottom:30px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Your Enquiry Details</p>
                    <p style="margin:0;font-size:15px;color:#d1d5db;"><strong style="color:#f97316;">Phone:</strong> ${lead.phone}</p>
                    ${lead.email ? `<p style="margin:8px 0 0;font-size:15px;color:#d1d5db;"><strong style="color:#f97316;">Email:</strong> ${lead.email}</p>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 30px;border-top:1px solid #1f2937;text-align:center;">
              <p style="margin:0;color:#4b5563;font-size:12px;">© ${new Date().getFullYear()} Moto Monk. All rights reserved.</p>
              <p style="margin:8px 0 0;color:#4b5563;font-size:12px;">You're receiving this because you submitted an enquiry on our website.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // For jsonTransport (dev mode), log the email object
    if ((info as any).message) {
      console.log('[Mailer] Dev mode — Email content:\n', (info as any).message);
    }
    console.log(`[Mailer] Welcome email sent to ${lead.email}`);
    return info;
  } catch (error) {
    console.error('[Mailer] Failed to send welcome email:', error);
  }
};
