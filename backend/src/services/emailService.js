const nodemailer = require('nodemailer');

const normalizeEnv = (value) => {
  if (value === undefined || value === null) return '';
  return String(value).trim().replace(/^['\"]|['\"]$/g, '');
};

const isTrue = (value) => ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());

const isEtherealHost = (host) => String(host || '').toLowerCase().includes('ethereal.email');
const isGmailUser = (user) => String(user || '').toLowerCase().endsWith('@gmail.com');

const maskValue = (value, prefix = 3, suffix = 4) => {
  if (!value) return 'MISSING';
  if (value.length <= prefix + suffix) return `${value.slice(0, 2)}***`;
  return `${value.slice(0, prefix)}***${value.slice(-suffix)}`;
};

const createTransporter = () => {
  let host = normalizeEnv(process.env.SMTP_HOST) || 'smtp.gmail.com';
  let port = parseInt(normalizeEnv(process.env.SMTP_PORT), 10) || 465;
  let secure = isTrue(normalizeEnv(process.env.SMTP_SECURE)) || port === 465;
  const user = normalizeEnv(process.env.SMTP_USER);
  let pass = normalizeEnv(process.env.SMTP_PASS);

  // Gmail app password is commonly copied with spaces: "xxxx xxxx xxxx xxxx".
  if (isGmailUser(user)) {
    pass = pass.replace(/\s+/g, '');
  }

  // Auto-fix common misconfiguration: Gmail credentials with Ethereal host.
  if (isGmailUser(user) && isEtherealHost(host)) {
    host = 'smtp.gmail.com';
    port = 465;
    secure = true;
  }

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }
  return null;
};

const sendEmail = async (email, subject, html) => {
  const transporter = createTransporter();

  if (!transporter) {
    throw new Error('SMTP transporter is not configured');
  }

  try {
    const message = {
      from: `"Bình Bún Bò" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    };

    await transporter.sendMail(message);
  } catch (err) {
    throw err;
  }
};

const sendVerificationEmail = async (email, code) => {
  const html = `<p>Mã xác thực: <strong style="font-size:24px">${code}</strong></p><p>Có hiệu lực trong 15 phút.</p>`;
  await sendEmail(email, 'Mã xác thực email - Bình Bún Bò', html);
};

const sendPasswordResetEmail = async (email, code) => {
  const html = `<p>Mã đặt lại mật khẩu: <strong style="font-size:24px">${code}</strong></p><p>Có hiệu lực trong 15 phút.</p>`;
  await sendEmail(email, 'Đặt lại mật khẩu - Bình Bún Bò', html);
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
