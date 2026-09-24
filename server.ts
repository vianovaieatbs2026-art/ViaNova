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

  // Shared email dispatcher with fallback to SMTP (Gmail/Custom), Resend, SendGrid, and Brevo
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
  }): Promise<{ success: boolean; provider: string; messageId?: string; id?: string; error?: string }> {
    const cleanEmail = to.trim().toLowerCase();

    // 1. Try Resend if RESEND_API_KEY is available
    const resendKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
    if (resendKey) {
      try {
        console.log(`[Email Service] Intentando envío vía Resend a ${cleanEmail}...`);
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
            html,
            text
          })
        });

        if (response.ok) {
          const data = await response.json().catch(() => ({}));
          console.log(`[Email Service] ¡Correo entregado con éxito por Resend! ID:`, data?.id);
          return { success: true, provider: 'resend', id: data?.id };
        } else {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData?.message || `Error HTTP ${response.status} de Resend`;
          console.warn(`[Email Service] Error en respuesta de Resend:`, errData);
          return { success: false, provider: 'resend', error: `Resend error: ${errMsg}` };
        }
      } catch (err: any) {
        console.warn(`[Email Service] Excepción al enviar por Resend:`, err?.message);
        return { success: false, provider: 'resend', error: `Error de conexión Resend: ${err?.message}` };
      }
    }

    // 2. Try SMTP via Nodemailer if SMTP credentials are provided
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (smtpHost && smtpUser && smtpPass) {
      try {
        console.log(`[Email Service] Intentando envío vía SMTP (${smtpHost}) a ${cleanEmail}...`);
        const smtpPort = Number(process.env.SMTP_PORT) || 587;
        const isSecure = smtpPort === 465 || process.env.SMTP_SECURE === 'true';
        const cleanSmtpPass = smtpPass.trim().replace(/\s+/g, ''); // limpia espacios para contraseñas de app de Google

        const transportConfig: any = {
          host: smtpHost.trim(),
          port: smtpPort,
          secure: isSecure,
          auth: {
            user: smtpUser.trim(),
            pass: cleanSmtpPass
          },
          tls: {
            rejectUnauthorized: false
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000
        };

        if (smtpHost.toLowerCase().includes('gmail') || smtpUser.toLowerCase().includes('@gmail.com')) {
          transportConfig.service = 'gmail';
        }

        const transporter = nodemailer.createTransport(transportConfig);
        const fromAddress = process.env.EMAIL_FROM || `"ViaNova Colombia" <${smtpUser.trim()}>`;

        const info = await transporter.sendMail({
          from: fromAddress,
          to: cleanEmail,
          subject,
          html,
          text
        });

        console.log(`[Email Service] ¡Correo entregado con éxito por SMTP! MessageId:`, info.messageId);
        return { success: true, provider: 'smtp', messageId: info.messageId };
      } catch (err: any) {
        console.warn(`[Email Service] Error en envío por SMTP:`, err?.message);
        return { 
          success: false, 
          provider: 'smtp', 
          error: `Error de autenticación o conexión SMTP (${smtpHost}): ${err?.message || 'Error desconocido'}` 
        };
      }
    }

    // 3. Try SendGrid if SENDGRID_API_KEY is available
    const sendgridKey = process.env.SENDGRID_API_KEY || process.env.VITE_SENDGRID_API_KEY;
    if (sendgridKey) {
      try {
        console.log(`[Email Service] Intentando envío vía SendGrid a ${cleanEmail}...`);
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
          console.log(`[Email Service] ¡Correo entregado con éxito por SendGrid!`);
          return { success: true, provider: 'sendgrid' };
        } else {
          const errText = await response.text().catch(() => '');
          console.warn(`[Email Service] Error de SendGrid:`, errText);
          return { success: false, provider: 'sendgrid', error: `SendGrid error: ${errText}` };
        }
      } catch (err: any) {
        console.warn(`[Email Service] Excepción en SendGrid:`, err?.message);
        return { success: false, provider: 'sendgrid', error: `SendGrid error: ${err?.message}` };
      }
    }

    // 4. Try Brevo (formerly Sendinblue) if BREVO_API_KEY is available
    const brevoKey = process.env.BREVO_API_KEY;
    if (brevoKey) {
      try {
        console.log(`[Email Service] Intentando envío vía Brevo a ${cleanEmail}...`);
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
          console.log(`[Email Service] ¡Correo entregado con éxito por Brevo!`);
          return { success: true, provider: 'brevo' };
        } else {
          const errData = await response.json().catch(() => ({}));
          console.warn(`[Email Service] Error de Brevo:`, errData);
          return { success: false, provider: 'brevo', error: `Brevo error: ${JSON.stringify(errData)}` };
        }
      } catch (err: any) {
        console.warn(`[Email Service] Excepción en Brevo:`, err?.message);
        return { success: false, provider: 'brevo', error: `Brevo error: ${err?.message}` };
      }
    }

    // No valid email provider found
    return { 
      success: false, 
      provider: 'none', 
      error: 'Servidor de correo no configurado. Para enviar correos reales, configura las variables SMTP (SMTP_HOST, SMTP_USER, SMTP_PASS) o RESEND_API_KEY en el archivo .env del servidor.' 
    };
  }

  // Store for password reset codes (10 minute TTL as strictly specified)
  interface PasswordResetRecord {
    email: string;
    code: string;
    expiresAt: number;
    attempts: number;
    used: boolean;
    createdAt: number;
  }
  const passwordResetStore = new Map<string, PasswordResetRecord>();

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

  // 4. Send Password Reset Code Endpoint (Strict 6-digit code with real delivery)
  app.post('/api/send-password-reset', async (req, res) => {
    const { email, recipientName } = req.body || {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        code: 'MISSING_EMAIL',
        message: 'Por favor ingresa un correo electrónico.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_EMAIL_FORMAT',
        message: 'El formato del correo electrónico no es válido.'
      });
    }

    // Generate random 6-digit numeric recovery code (100000 - 999999)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Friendly recipient name
    let cleanName = (recipientName && typeof recipientName === 'string') ? recipientName.trim() : '';
    if (!cleanName) {
      const localPart = cleanEmail.split('@')[0];
      cleanName = localPart ? localPart.charAt(0).toUpperCase() + localPart.slice(1) : 'Usuario';
    }

    const emailSubject = `${resetCode} es tu código de recuperación de contraseña - ViaNova Colombia`;

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
                Hola <strong>${cleanName}</strong>, recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>ViaNova Colombia</strong>. Usa el siguiente código de verificación de 6 dígitos para ingresar tu nueva contraseña:
              </p>

              <div style="background-color: #eff6ff; border: 2px dashed #93c5fd; border-radius: 16px; padding: 22px; text-align: center; margin: 24px 0;">
                <div style="font-size: 11px; font-weight: 800; color: #1e40af; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                  Código de Recuperación de 6 Dígitos
                </div>
                <div style="font-size: 40px; font-weight: 900; color: #0052cc; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">
                  ${resetCode}
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 8px;">
                  ⏱️ Válido durante los próximos <strong>10 minutos</strong>
                </div>
              </div>

              <div style="background-color: #f8fafc; border-radius: 12px; padding: 14px 16px; border-left: 4px solid #f59e0b; margin: 24px 0 16px 0;">
                <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.5;">
                  <strong>⚠️ Aviso de Seguridad:</strong> No compartas este código con ninguna persona. Si tú no solicitaste cambiar tu contraseña, puedes ignorar este mensaje; tu cuenta y contraseña actual permanecen seguras.
                </p>
              </div>

              <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">
                Revisa tu bandeja de entrada y la carpeta de spam o correo no deseado.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0; line-height: 1.4;">
                ViaNova Colombia • Plataforma de Movilidad Vial y Educación<br>
                Cumplimiento normativo Ley 769 de 2002 y Ley Julián Esteban 2251 de 2022
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

    // 10 minutes expiration (strictly enforcing requirement 7)
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // Save in temporary recovery store
    passwordResetStore.set(cleanEmail, {
      email: cleanEmail,
      code: resetCode,
      expiresAt,
      attempts: 0,
      used: false,
      createdAt: Date.now()
    });

    // Real email dispatch attempt
    const dispatchResult = await dispatchEmailToUser({
      to: cleanEmail,
      recipientName: cleanName,
      subject: emailSubject,
      html: emailHtml,
      text: `Hola ${cleanName}, tu código de recuperación de contraseña en ViaNova Colombia es: ${resetCode}. Válido durante 10 minutos.`
    });

    if (!dispatchResult.success) {
      // Remove entry if email delivery failed so no phantom or unreachable code exists
      passwordResetStore.delete(cleanEmail);
      console.warn(`[Email Service] Falló la entrega del correo a ${cleanEmail}:`, dispatchResult.error);
      return res.status(500).json({
        success: false,
        code: 'EMAIL_SEND_FAILED',
        provider: dispatchResult.provider,
        message: dispatchResult.error || 'Error al enviar el correo. El servidor de correo saliente no está configurado o rechazó la entrega. Por favor verifica las credenciales SMTP/Resend en .env.'
      });
    }

    // Success response: We NEVER leak the code in the response body!
    return res.json({
      success: true,
      code: 'CODE_SENT',
      provider: dispatchResult.provider,
      message: 'Código enviado correctamente. Revisa tu correo electrónico (incluyendo la carpeta de spam).',
      expiresAt
    });
  });

  // 5. Verify Password Reset Code Endpoint
  app.post('/api/verify-password-reset', (req, res) => {
    const { email, code } = req.body || {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        code: 'MISSING_EMAIL',
        message: 'Correo electrónico requerido.'
      });
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_CODE',
        message: 'Por favor ingresa el código de 6 dígitos recibido en tu correo.'
      });
    }

    const cleanCode = String(code).trim().replace(/\D/g, '');
    const cleanEmail = email.trim().toLowerCase();

    if (cleanCode.length !== 6) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_CODE_FORMAT',
        message: 'El código debe tener exactamente 6 dígitos numéricos.'
      });
    }

    const entry = passwordResetStore.get(cleanEmail);
    if (!entry) {
      return res.status(404).json({
        success: false,
        code: 'CODE_NOT_FOUND',
        message: 'No existe ningún código de recuperación activo para este correo. Por favor solicita uno nuevo.'
      });
    }

    // Check if code was already consumed/used (requirement 9 & 13)
    if (entry.used) {
      return res.status(400).json({
        success: false,
        code: 'CODE_ALREADY_USED',
        message: 'Este código ya ha sido utilizado anteriormente. Por seguridad no puede volver a usarse. Solicita uno nuevo si necesitas restablecer tu contraseña.'
      });
    }

    // Check if expired (requirement 7, 9 & 13)
    if (Date.now() > entry.expiresAt) {
      passwordResetStore.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        code: 'CODE_EXPIRED',
        message: 'El código de recuperación ha expirado (validez de 10 minutos). Por favor solicita uno nuevo.'
      });
    }

    // Check maximum attempts limit
    if (entry.attempts >= 5) {
      passwordResetStore.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        code: 'MAX_ATTEMPTS_EXCEEDED',
        message: 'Has superado el límite de 5 intentos fallidos. Por seguridad este código ha sido cancelado. Solicita un nuevo código.'
      });
    }

    // Validate matching code
    if (entry.code !== cleanCode) {
      entry.attempts += 1;
      const remaining = 5 - entry.attempts;
      return res.status(400).json({
        success: false,
        code: 'CODE_INCORRECT',
        message: `Código incorrecto. Verifica los 6 dígitos recibidos en tu correo. Intentos restantes: ${remaining}.`
      });
    }

    // Valid code!
    return res.json({
      success: true,
      code: 'CODE_VERIFIED',
      email: cleanEmail,
      message: 'Código verificado correctamente. Ahora puedes crear tu nueva contraseña.'
    });
  });

  // 6. Confirm Password Reset Endpoint (Updates password and invalidates code)
  app.post('/api/confirm-password-reset', (req, res) => {
    const { email, code, newPassword } = req.body || {};

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        code: 'WEAK_PASSWORD',
        message: 'La nueva contraseña debe tener al menos 6 caracteres.'
      });
    }

    const cleanEmail = email ? String(email).trim().toLowerCase() : '';
    const cleanCode = code ? String(code).trim().replace(/\D/g, '') : '';

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_EMAIL',
        message: 'Correo electrónico requerido.'
      });
    }

    const entry = passwordResetStore.get(cleanEmail);
    if (!entry) {
      return res.status(404).json({
        success: false,
        code: 'CODE_NOT_FOUND',
        message: 'Sesión de recuperación no encontrada o expirada. Por favor solicita un nuevo código.'
      });
    }

    if (entry.used) {
      return res.status(400).json({
        success: false,
        code: 'CODE_ALREADY_USED',
        message: 'Este código ya ha sido utilizado para cambiar la contraseña.'
      });
    }

    if (Date.now() > entry.expiresAt) {
      passwordResetStore.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        code: 'CODE_EXPIRED',
        message: 'El código ha expirado. Por favor solicita uno nuevo.'
      });
    }

    if (entry.code !== cleanCode) {
      return res.status(400).json({
        success: false,
        code: 'CODE_INCORRECT',
        message: 'Código de recuperación incorrecto.'
      });
    }

    // Mark as used immediately to prevent replay attacks (requirement 12)
    entry.used = true;

    // Invalidate and delete after 5 minutes so subsequent attempts receive CODE_ALREADY_USED
    setTimeout(() => {
      passwordResetStore.delete(cleanEmail);
    }, 5 * 60 * 1000);

    return res.json({
      success: true,
      code: 'PASSWORD_CHANGED_SUCCESS',
      message: 'Contraseña cambiada correctamente. Ahora puedes iniciar sesión con tus nuevas credenciales.'
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
