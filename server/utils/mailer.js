const nodemailer = require("nodemailer");

function createTransporter() {
  // For Gmail App Password auth, host/port are optional; nodemailer will infer via `service`.
  // If you want custom SMTP, set SMTP_HOST/SMTP_PORT and remove `service`.
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    service: process.env.SMTP_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

const transporter = createTransporter();

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function escapeHtml(unsafe) {
  return String(unsafe)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function baseHtml({ title, preheader, bodyHtml }) {
  const safeTitle = escapeHtml(title);
  const safePreheader = escapeHtml(preheader || "");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
  </head>
  <body style="margin:0;padding:0;background:#0b1220;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${safePreheader}
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#0f172a;border:1px solid #1f2a44;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;background:linear-gradient(90deg,#111827,#0f172a);border-bottom:1px solid #1f2a44;">
                <div style="font-size:16px;font-weight:700;color:#e5e7eb;letter-spacing:0.2px;">
                  Chess
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;color:#e5e7eb;font-size:14px;line-height:1.55;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 24px;border-top:1px solid #1f2a44;color:#9ca3af;font-size:12px;">
                If you didn’t request this, you can safely ignore this email.
              </td>
            </tr>
          </table>
          <div style="margin-top:14px;color:#64748b;font-size:12px;">
            © ${new Date().getFullYear()} Chess
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function sendMail({ to, subject, text, html }) {
  requireEnv("EMAIL_USER");
  requireEnv("GMAIL_APP_PASSWORD");

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });

  if (process.env.NODE_ENV !== "test") {
    console.log("Email sent:", { to, subject, messageId: info.messageId });
  }
  return info;
}

function buildWelcomeEmail({ username }) {
  const safeUsername = escapeHtml(username || "there");
  const subject = `Welcome to Chess, ${safeUsername}!`;
  const text = `Hi ${username || "there"},\n\nWelcome to Chess! Your account is ready.\n\nHave fun,\nChess`;
  const html = baseHtml({
    title: "Welcome to Chess",
    preheader: "Your Chess account is ready.",
    bodyHtml: `
      <h1 style="margin:0 0 12px;font-size:18px;color:#ffffff;">Welcome, ${safeUsername}!</h1>
      <p style="margin:0 0 12px;color:#cbd5e1;">Your account has been created successfully.</p>
      <p style="margin:0;color:#cbd5e1;">Have fun playing.</p>
    `,
  });
  return { subject, text, html };
}

function buildPasswordResetEmail({ username, resetUrl, minutesValid }) {
  const safeUsername = escapeHtml(username || "there");
  const safeUrl = escapeHtml(resetUrl);
  const subject = "Reset your Chess password";
  const text =
    `Hi ${username || "there"},\n\n` +
    `We received a request to reset your password. Use this link:\n${resetUrl}\n\n` +
    `This link expires in ${minutesValid} minutes.\n\n` +
    `If you didn't request this, ignore this email.\n`;
  const html = baseHtml({
    title: "Reset your password",
    preheader: `Password reset link (expires in ${minutesValid} minutes).`,
    bodyHtml: `
      <h1 style="margin:0 0 12px;font-size:18px;color:#ffffff;">Reset your password</h1>
      <p style="margin:0 0 14px;color:#cbd5e1;">Hi ${safeUsername}, we received a request to reset your password.</p>
      <p style="margin:0 0 18px;color:#cbd5e1;">This link expires in <b>${escapeHtml(minutesValid)}</b> minutes.</p>
      <p style="margin:0 0 18px;">
        <a href="${safeUrl}" style="display:inline-block;padding:10px 14px;background:#22c55e;color:#0b1220;text-decoration:none;border-radius:10px;font-weight:700;">
          Reset password
        </a>
      </p>
      <p style="margin:0 0 6px;color:#94a3b8;font-size:12px;">Or paste this URL into your browser:</p>
      <p style="margin:0;color:#93c5fd;font-size:12px;word-break:break-all;">${safeUrl}</p>
    `,
  });
  return { subject, text, html };
}

async function sendWelcomeEmail({ to, username }) {
  const { subject, text, html } = buildWelcomeEmail({ username });
  return sendMail({ to, subject, text, html });
}

async function sendPasswordResetEmail({ to, username, resetUrl, minutesValid = 60 }) {
  const { subject, text, html } = buildPasswordResetEmail({ username, resetUrl, minutesValid });
  return sendMail({ to, subject, text, html });
}

module.exports = {
  sendMail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  buildWelcomeEmail,
  buildPasswordResetEmail,
};