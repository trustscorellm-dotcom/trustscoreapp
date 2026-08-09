import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | null | undefined;

function getTransporter(): Transporter | null {
  if (transporter !== undefined) return transporter;

  const { SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_USER || !SMTP_PASSWORD) {
    transporter = null;
    return transporter;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  return transporter;
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<void> {
  const client = getTransporter();

  if (!client) {
    // SMTP_USER/SMTP_PASSWORD aren't configured yet (see .env.local) — log and
    // no-op rather than throw, consistent with every caller treating this as
    // fire-and-forget/informational-only.
    console.warn("Email not sent — SMTP not configured:", { to, subject });
    return;
  }

  await client.sendMail({
    from: process.env.SMTP_FROM || "trustscore.llm@gmail.com",
    to,
    subject,
    html,
    text,
  });
}
