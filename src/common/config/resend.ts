import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export async function sendLoginNotification(
  email: string,
  lastLogin: string,
  configService: ConfigService,
) {
  const resendApiKey = configService.get<string>('RESEND_API_KEY');
//  console.log("email", email, "lastLogin", lastLogin, "resendApiKey", resendApiKey);
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const resend = new Resend(resendApiKey);
  const logoUrl = 'https://res.cloudinary.com/diuy2xilf/image/upload/v1760314904/portfolio/qjl8mv0wvcic9kazotnx.png';
  const html = `
  <html>
  <body style="font-family: Arial, sans-serif; color:#333;">
    <div style="max-width:600px;margin:0 auto;padding:20px;border:1px solid #eaeaea;">
      <div style="text-align:center;">
        <img src="${logoUrl}" alt="Logo" style="max-width:150px;height:auto;margin-bottom:20px;" />
      </div>
      <h2 style="color:#111;">Login Notification</h2>
      <p>This is a <strong>test email</strong> notifying you of a login to <a href="https://bullmq.sudipsharma.com.np">bullmq.sudipsharma.com.np</a>.</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px;border:1px solid #eee;font-weight:600;">User Email</td>
          <td style="padding:8px;border:1px solid #eee;">${email}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #eee;font-weight:600;">Last Login</td>
          <td style="padding:8px;border:1px solid #eee;">${lastLogin}</td>
        </tr>
      </table>
      <p style="margin-top:20px;color:#666;">If this wasn't you, please secure your account.</p>
      <hr />
      <p style="font-size:12px;color:#999;">© ${new Date().getFullYear()} bullmq.sudipsharma.com.np</p>
    </div>
  </body>
  </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'BullMQ <bullmq@sudipsharma.com.np>',
      to: [email],
      subject: 'Login Notification — Test Email',
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    console.log('Email sent:', data);
    return data;
  } catch (err) {
    console.error('Failed to send email', err);
    throw err;
  }
}