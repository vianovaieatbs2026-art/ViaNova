import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 2. Email provider configuration status endpoint
  app.get('/api/email-config-status', (req, res) => {
    const hasResend = Boolean(process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY);
    const hasSendGrid = Boolean(process.env.SENDGRID_API_KEY || process.env.VITE_SENDGRID_API_KEY);
    const hasBrevo = Boolean(process.env.BREVO_API_KEY);
    const hasSmtp = Boolean(
      process.env.SMTP_HOST && 
      process.env.SMTP_USER && 
      process.env.SMTP_PASS
    );

    const activeProviders: string[] = [];
    if (hasResend) activeProviders.push('Resend');
    if (hasSmtp) activeProviders.push(`SMTP (${process.env.SMTP_HOST})`);
    if (hasSendGrid) activeProviders.push('SendGrid');
    if (hasBrevo) activeProviders.push('Brevo');

    res.json({
      configured: activeProviders.length > 0,
      activeProviders,
      details: {
        hasResend,
        hasSendGrid,
        hasBrevo,
        hasSmtp,
        smtpHost: process.env.SMTP_HOST ? `${process.env.SMTP_HOST}:${process.env.SMTP_PORT || 587}` : null,
        fromEmail: process.env.EMAIL_FROM || process.env.SMTP_USER || 'soporte@vianova.co'
      }
    });
  });

  // Shared email dispatcher with fallback to Resend, SMTP, SendGrid, and Brevo
  async function dispatchEmailToUser({
    to,
    subject,
    html,
    text,
    recipientName = 'Usuario'
  }: {
    to: string;
    subject: string;
    html: string;
    text: string;
    recipientName?: string;
  }): Promise<{ success: boolean; provider: string; messageId?: string; id?: string }> {
    const cleanEmail = to.trim().toLowerCase();

    // 1. Try Resend if RESEND_API_KEY is available
    const resendKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
    if (resendKey) {
      try {
        console.log(`[Email Service] Attempting dispatch via Resend to ${cleanEmail}...`);
        const fromHeader = process.env.EMAIL_FROM || 'ViaNova Colombia <onboarding@resend.dev>';
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey.trim()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromHeader,
            to: [cleanEmail],
            subject,
            html
          })
        });

        if (response.ok) {
          const data = await response.json().catch(() => ({}));
          console.log(`[Email Service] Successfully delivered via Resend! ID:`, data?.id);
          return { success: true, provider: 'resend', id: data?.id };
        } else {
          const errData = await response.json().catch(() => ({}));
          console.warn(`[Email Service] Resend API response:`, errData);
        }
      } catch (err: any) {
        console.warn(`[Email Service] Resend dispatch exception:`, err?.message);
      }
    }

    // 2. Try SMTP via Nodemailer if SMTP credentials are provided
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (smtpHost && smtpUser && smtpPass) {
      try {
        console.log(`[Email Service] Attempting dispatch via SMTP (${smtpHost}) to ${cleanEmail}...`);
        const smtpPort = Number(process.env.SMTP_PORT) || 587;
        const isSecure = smtpPort === 465 || process.env.SMTP_SECURE === 'true';

        const transporter = nodemailer.createTransport({
          host: smtpHost.trim(),
          port: smtpPort,
          secure: isSecure,
          auth: {
            user: smtpUser.trim(),
            pass: smtpPass.trim()
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        const fromAddress = process.env.EMAIL_FROM || `"ViaNova Colombia" <${smtpUser.trim()}>`;

        const info = await transporter.sendMail({
          from: fromAddress,
          to: cleanEmail,
          subject,
          html,
          text
        });

        console.log(`[Email Service] Successfully delivered via SMTP! MessageId:`, info.messageId);
        return { success: true, provider: 'smtp', messageId: info.messageId };
      } catch (err: any) {
        console.warn(`[Email Service] SMTP dispatch error:`, err?.message);
      }
    }

    // 3. Try SendGrid if SENDGRID_API_KEY is available
    const sendgridKey = process.env.SENDGRID_API_KEY || process.env.VITE_SENDGRID_API_KEY;
    if (sendgridKey) {
      try {
        console.log(`[Email Service] Attempting dispatch via SendGrid to ${cleanEmail}...`);
        const fromEmail = process.env.EMAIL_FROM || 'soporte@vianova.co';
        const cleanFromEmail = fromEmail.includes('<')
          ? fromEmail.substring(fromEmail.indexOf('<') + 1, fromEmail.indexOf('>'))
          : fromEmail;

        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sendgridKey.trim()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: cleanEmail }] }],
            from: { email: cleanFromEmail, name: 'ViaNova Colombia' },
            subject,
            content: [{ type: 'text/html', value: html }]
          })
        });

        if (response.ok) {
          console.log(`[Email Service] Successfully delivered via SendGrid!`);
          return { success: true, provider: 'sendgrid' };
        } else {
          const errText = await response.text().catch(() => '');
          console.warn(`[Email Service] SendGrid error:`, errText);
        }
      } catch (err: any) {
        console.warn(`[Email Service] SendGrid dispatch exception:`, err?.message);
      }
    }

    // 4. Try Brevo (formerly Sendinblue) if BREVO_API_KEY is available
    const brevoKey = process.env.BREVO_API_KEY;
    if (brevoKey) {
      try {
        console.log(`[Email Service] Attempting dispatch via Brevo to ${cleanEmail}...`);
        const fromEmail = process.env.EMAIL_FROM || 'soporte@vianova.co';
        const cleanFromEmail = fromEmail.includes('<')
          ? fromEmail.substring(fromEmail.indexOf('<') + 1, fromEmail.indexOf('>'))
          : fromEmail;

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoKey.trim(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sender: { name: 'ViaNova Colombia', email: cleanFromEmail },
            to: [{ email: cleanEmail, name: recipientName }],
            subject,
            htmlContent: html
          })
        });

        if (response.ok) {
          console.log(`[Email Service] Successfully delivered via Brevo!`);
          return { success: true, provider: 'brevo' };
        } else {
          const errData = await response.json().catch(() => ({}));
          console.warn(`[Email Service] Brevo error:`, errData);
        }
      } catch (err: any) {
        console.warn(`[Email Service] Brevo dispatch exception:`, err?.message);
      }
    }

    return { success: false, provider: 'none' };
  }

  // 3. Send Verification Code (OTP) Endpoint
  app.post('/api/send-verification-code', async (req, res) => {
    const { email, code, recipientName } = req.body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Correo electrónico inválido o no proporcionado.'
      });
    }

    const otpCode = (code && typeof code === 'string' && code.trim().length >= 4)
      ? code.trim()
      : Math.floor(100000 + Math.random() * 900000).toString();

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (recipientName && typeof recipientName === 'string') ? recipientName.trim() : 'Usuario';
    const emailSubject = `${otpCode} es tu código de verificación de ViaNova Colombia`;

    const emailHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Código de Verificación - ViaNova Colombia</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.07); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background: linear-gradient(135deg, #0052cc 0%, #0a2540 100%); padding: 32px 24px; text-align: center;">
              <div style="font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
                <span style="color: #38bdf8;">Via</span>Nova
              </div>
              <div style="font-size: 11px; font-weight: 800; color: #bae6fd; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">
                Seguridad & Movilidad Vial Colombia
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 36px 32px; text-align: left;">
              <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0;">
                Tu código de verificación de inicio de sesión
              </h1>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
                Hola <strong>${cleanName}</strong>, recibimos tu solicitud para acceder a tu portal en ViaNova Colombia. Usa el siguiente código para completar tu ingreso:
              </p>

              <div style="background-color: #eff6ff; border: 2px dashed #93c5fd; border-radius: 16px; padding: 22px; text-align: center; margin: 24px 0;">
                <div style="font-size: 11px; font-weight: 800; color: #1e40af; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                  Código de Seguridad OTP
                </div>
                <div style="font-size: 40px; font-weight: 900; color: #0052cc; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">
                  ${otpCode}
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 8px;">
                  Válido durante los próximos <strong>10 minutos</strong>
                </div>
              </div>

              <div style="background-color: #f8fafc; border-radius: 12px; padding: 14px 16px; border-left: 4px solid #f59e0b; margin: 24px 0 16px 0;">
                <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.5;">
                  <strong>⚠️ Aviso de Seguridad:</strong> No compartas este código con nadie. El equipo de ViaNova nunca te lo solicitará por teléfono, WhatsApp o redes sociales.
                </p>
              </div>

              <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">
                Si tú no solicitaste este código, puedes ignorar este mensaje de forma segura.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0; line-height: 1.4;">
                ViaNova Colombia • Plataforma de Educación y Movilidad Vial Inteligente<br>
                Cumplimiento Ley 769 de 2002 y Ley Julián Esteban 2251 de 2022
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const dispatchResult = await dispatchEmailToUser({
      to: cleanEmail,
      recipientName: cleanName,
      subject: emailSubject,
      html: emailHtml,
      text: `Tu código de verificación de ViaNova Colombia es: ${otpCode}. Válido durante 10 minutos.`
    });

    if (dispatchResult.success) {
      return res.json({
        success: true,
        provider: dispatchResult.provider,
        message: 'Código enviado, revisa tu correo incluyendo spam',
        messageId: dispatchResult.messageId || dispatchResult.id
      });
    }

    // Fallback if no external provider is configured
    console.info(`[Email Service] Fallback for ${cleanEmail}: code is ${otpCode}`);
    return res.json({
      success: true,
      provider: 'local_dev',
      notConfigured: true,
      message: 'Código enviado, revisa tu correo incluyendo spam',
      code: otpCode
    });
  });

  // 4. Send Password Reset Code Endpoint
  app.post('/api/send-password-reset', async (req, res) => {
    const { email, code } = req.body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Correo electrónico inválido o no proporcionado.'
      });
    }

    const resetCode = (code && typeof code === 'string' && code.trim().length >= 4)
      ? code.trim()
      : Math.floor(100000 + Math.random() * 900000).toString();

    const cleanEmail = email.trim().toLowerCase();
    const localPart = cleanEmail.split('@')[0];
    const cleanName = localPart ? localPart.charAt(0).toUpperCase() + localPart.slice(1) : 'Usuario';
    const emailSubject = `${resetCode} es tu código para recuperar tu contraseña - ViaNova Colombia`;

    const emailHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperación de Contraseña - ViaNova Colombia</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.07); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background: linear-gradient(135deg, #0052cc 0%, #0a2540 100%); padding: 32px 24px; text-align: center;">
              <div style="font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
                <span style="color: #38bdf8;">Via</span>Nova
              </div>
              <div style="font-size: 11px; font-weight: 800; color: #bae6fd; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">
                Seguridad & Movilidad Vial Colombia
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 36px 32px; text-align: left;">
              <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0;">
                Recuperación de Contraseña
              </h1>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
                Hola <strong>${cleanName}</strong>, recibimos una solicitud para restablecer la contraseña de tu cuenta en ViaNova Colombia. Usa el siguiente código de verificación para definir tu nueva contraseña:
              </p>

              <div style="background-color: #eff6ff; border: 2px dashed #93c5fd; border-radius: 16px; padding: 22px; text-align: center; margin: 24px 0;">
                <div style="font-size: 11px; font-weight: 800; color: #1e40af; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                  Código de Verificación
                </div>
                <div style="font-size: 40px; font-weight: 900; color: #0052cc; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">
                  ${resetCode}
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 8px;">
                  Válido durante los próximos <strong>15 minutos</strong>
                </div>
              </div>

              <div style="background-color: #f8fafc; border-radius: 12px; padding: 14px 16px; border-left: 4px solid #f59e0b; margin: 24px 0 16px 0;">
                <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.5;">
                  <strong>⚠️ Aviso de Seguridad:</strong> Si tú no solicitaste cambiar tu contraseña, puedes ignorar este mensaje de forma segura. Tu cuenta y contraseña actual permanecen protegidas.
                </p>
              </div>

              <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">
                Revisa tu correo incluyendo spam o correo no deseado.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0; line-height: 1.4;">
                ViaNova Colombia • Plataforma de Educación y Movilidad Vial Inteligente<br>
                Cumplimiento Ley 769 de 2002 y Ley Julián Esteban 2251 de 2022
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const dispatchResult = await dispatchEmailToUser({
      to: cleanEmail,
      recipientName: cleanName,
      subject: emailSubject,
      html: emailHtml,
      text: `Tu código de recuperación de contraseña en ViaNova Colombia es: ${resetCode}. Válido durante 15 minutos.`
    });

    return res.json({
      success: true,
      provider: dispatchResult.provider,
      notConfigured: !dispatchResult.success,
      message: 'Se te envió un código de verificación al correo',
      code: resetCode
    });
  });

  // 4. Test Email Endpoint (Verifies SMTP / Resend / SendGrid without login flow)
  app.post('/api/send-test-email', async (req, res) => {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Correo inválido.' });
    }
    const testCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Delegate to verification code sender
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/api/send-verification-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: testCode,
          recipientName: 'Prueba de Configuración'
        })
      });
      const data = await response.json();
      return res.json({
        ...data,
        testCode
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Error al procesar prueba.' });
    }
  });

  // 5. Vite middleware integration for development & static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ViaNova Express + Vite Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
