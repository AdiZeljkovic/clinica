import nodemailer from 'nodemailer';

/* SMTP mail — aktivan samo kad je SMTP_HOST postavljen (env), inače no-op.
   Poruke se svakako čuvaju u bazi; mail je notifikacija. */

let transporter: nodemailer.Transporter | null | undefined;

/* Lijena inicijalizacija — env varijable se čitaju tek pri prvom slanju,
   nakon što je dotenv sigurno učitan */
function getTransporter(): nodemailer.Transporter | null {
  if (transporter !== undefined) return transporter;
  transporter = process.env.SMTP_HOST
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true', // true za 465
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
      })
    : null;
  return transporter;
}

export async function sendContactNotification(data: {
  first_name: string; last_name: string; email: string; subject?: string; message: string;
}): Promise<void> {
  const t = getTransporter();
  if (!t) {
    console.log('SMTP nije konfigurisan (SMTP_HOST) — kontakt poruka je samo u bazi.');
    return;
  }
  const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'adriaticsm@sunwavepharma.com';
  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || `Bioclinica web <${process.env.SMTP_USER || 'noreply@bioclinica.ba'}>`,
      to: CONTACT_EMAIL,
      replyTo: data.email,
      subject: `[Bioclinica kontakt] ${data.subject || 'Nova poruka sa sajta'}`,
      text: [
        `Ime: ${data.first_name} ${data.last_name}`,
        `Email: ${data.email}`,
        data.subject ? `Naslov: ${data.subject}` : null,
        '',
        data.message,
      ].filter(Boolean).join('\n'),
    });
  } catch (err) {
    // mail ne smije oboriti zahtjev — poruka je već u bazi
    console.error('Slanje kontakt maila nije uspjelo:', err);
  }
}
