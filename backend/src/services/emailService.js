const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

const sendVerificationEmail = async (email, code) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
      <div style="background: #dc2626; padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Bình Bún Bò</h1>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
        <h2 style="color: #374151; margin: 0 0 16px;">Xác thực email</h2>
        <p style="color: #6b7280; font-size: 16px;">Mã xác thực của bạn là:</p>
        <div style="background: white; padding: 16px; text-align: center; border-radius: 8px; border: 2px dashed #dc2626; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #dc2626;">${code}</span>
        </div>
        <p style="color: #9ca3af; font-size: 14px;">Mã có hiệu lực trong 15 phút. Không chia sẻ mã này với ai.</p>
      </div>
    </div>
  `;

  const transporter = createTransporter();
  if (transporter) {
    await transporter.sendMail({
      from: `"Bình Bún Bò" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Mã xác thực email - Bình Bún Bò',
      html,
    });
  } else {
    console.log('\n📧 ===== EMAIL (Dev Mode) =====');
    console.log(`To: ${email}`);
    console.log(`Subject: Mã xác thực email - Bình Bún Bò`);
    console.log(`Code: ${code}`);
    console.log('===============================\n');
  }
};

const sendPasswordResetEmail = async (email, code) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
      <div style="background: #dc2626; padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Bình Bún Bò</h1>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
        <h2 style="color: #374151; margin: 0 0 16px;">Đặt lại mật khẩu</h2>
        <p style="color: #6b7280; font-size: 16px;">Mã đặt lại mật khẩu của bạn là:</p>
        <div style="background: white; padding: 16px; text-align: center; border-radius: 8px; border: 2px dashed #dc2626; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #dc2626;">${code}</span>
        </div>
        <p style="color: #9ca3af; font-size: 14px;">Mã có hiệu lực trong 15 phút. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
      </div>
    </div>
  `;

  const transporter = createTransporter();
  if (transporter) {
    await transporter.sendMail({
      from: `"Bình Bún Bò" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Đặt lại mật khẩu - Bình Bún Bò',
      html,
    });
  } else {
    console.log('\n📧 ===== PASSWORD RESET EMAIL (Dev Mode) =====');
    console.log(`To: ${email}`);
    console.log(`Subject: Đặt lại mật khẩu - Bình Bún Bò`);
    console.log(`Code: ${code}`);
    console.log('==============================================\n');
  }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
