import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendOrderEmail(to: string, subject: string, html: string) {
  const msg = {
    to,
    from: process.env.EMAIL_FROM!,
    subject,
    html,
  };
  await sgMail.send(msg);
}

export function orderConfirmationTemplate(itemTitle: string): string {
  return `
    <div style="font-family: sans-serif;">
      <h2>Thanks for your order!</h2>
      <p>You purchased: <strong>${itemTitle}</strong></p>
      <p>We'll notify you when it's ready.</p>
      <p style="font-size: 0.8em; color: #888">This email was sent by ReWind Marketplace</p>
    </div>
  `;
}
