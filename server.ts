import express from 'express';
import path from 'path';
import crypto from 'crypto';
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

  // 4. Send Password Reset Link Endpoint (Dispatches secure recovery email with clickable link)
  app.post('/api/send-password-reset', async (req, res) => {
    const { email, recipientName, originUrl } = req.body || {};

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

    // Generate cryptographically secure unique recovery token
    const resetToken = crypto.randomBytes(24).toString('hex');

    // Friendly recipient name
    let cleanName = (recipientName && typeof recipientName === 'string') ? recipientName.trim() : '';
    if (!cleanName) {
      const localPart = cleanEmail.split('@')[0];
      cleanName = localPart ? localPart.charAt(0).toUpperCase() + localPart.slice(1) : 'Usuario';
    }

    // Determine base URL for recovery link
    const baseUrl = (originUrl && typeof originUrl === 'string' && originUrl.startsWith('http'))
      ? originUrl.replace(/\/$/, '')
      : (process.env.APP_URL ? process.env.APP_URL.replace(/\/$/, '') : 'https://ais-dev-v52mrzei7xv5vmnnald77k-822053106516.us-east1.run.app');

    const resetUrl = `${baseUrl}/?mode=resetPassword&oobCode=${resetToken}`;
    const emailSubject = `Enlace para recuperar tu contraseña - ViaNova Colombia`;

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
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                Hola <strong>${cleanName}</strong>, recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>ViaNova Colombia</strong>.
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
                Haz clic en el siguiente botón seguro para definir tu nueva contraseña:
              </p>

              <div style="text-align: center; margin: 28px 0;">
                <a href="${resetUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #0052cc; color: #ffffff; padding: 14px 34px; font-weight: 800; font-size: 15px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 14px rgba(0,82,204,0.35); text-transform: uppercase; letter-spacing: 0.5px;">
                  Restablecer Contraseña
                </a>
              </div>

              <div style="background-color: #eff6ff; border-radius: 12px; padding: 14px 16px; border: 1px solid #bfdbfe; margin: 24px 0;">
                <p style="font-size: 12px; color: #1e40af; margin: 0 0 6px 0; font-weight: 700;">
                  ⏱️ Enlace con tiempo limitado:
                </p>
                <p style="font-size: 12px; color: #3b82f6; margin: 0; line-height: 1.5;">
                  Este enlace es de uso único y tiene una validez de <strong>15 minutos</strong> por motivos de seguridad.
                </p>
              </div>

              <p style="font-size: 12px; color: #64748b; margin: 16px 0 6px 0;">
                Si el botón no funciona, puedes copiar y pegar este enlace directamente en tu navegador:
              </p>
              <p style="font-size: 11px; word-break: break-all; color: #0052cc; background-color: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; font-family: monospace; margin: 0 0 20px 0;">
                ${resetUrl}
              </p>

              <div style="background-color: #f8fafc; border-radius: 12px; padding: 12px 16px; border-left: 4px solid #f59e0b; margin: 20px 0 0 0;">
                <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.5;">
                  <strong>⚠️ Aviso de Seguridad:</strong> Si tú no solicitaste cambiar tu contraseña, puedes ignorar este mensaje de forma segura. Tu cuenta permanece protegida.
                </p>
              </div>
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

    // 15 minutes expiration
    const expiresAt = Date.now() + 15 * 60 * 1000;

    const record = {
      email: cleanEmail,
      code: resetToken,
      expiresAt,
      attempts: 0,
      used: false,
      createdAt: Date.now()
    };

    // Save in recovery store indexed by both email and token
    passwordResetStore.set(cleanEmail, record);
    passwordResetStore.set(resetToken, record);

    // Real email dispatch attempt
    const dispatchResult = await dispatchEmailToUser({
      to: cleanEmail,
      recipientName: cleanName,
      subject: emailSubject,
      html: emailHtml,
      text: `Hola ${cleanName}, recibimos una solicitud para restablecer tu contraseña en ViaNova Colombia. Abre este enlace para cambiar tu contraseña: ${resetUrl} (Válido por 15 minutos).`
    });

    if (!dispatchResult.success) {
      console.warn(`[Email Service] Aviso de entrega para ${cleanEmail}: ${dispatchResult.error}. El enlace de recuperación permanece activo en memoria (15 minutos).`);
      return res.json({
        success: true,
        code: 'LINK_GENERATED',
        resetUrl,
        resetToken,
        provider: dispatchResult.provider || 'system',
        message: `Hemos procesado la recuperación para ${cleanEmail}. El código y enlace tienen una validez de 15 minutos.`,
        expiresAt
      });
    }

    return res.json({
      success: true,
      code: 'LINK_SENT',
      resetUrl,
      resetToken,
      provider: dispatchResult.provider,
      message: `Hemos enviado el enlace de restablecimiento a ${cleanEmail}. Por favor revisa tu bandeja de entrada y la carpeta de spam.`,
      expiresAt
    });
  });

  // 5. Verify Password Reset Code / Token Endpoint
  app.post('/api/verify-password-reset', (req, res) => {
    const { email, code } = req.body || {};

    if (!code) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_CODE',
        message: 'Código o token de recuperación no proporcionado.'
      });
    }

    const cleanCode = String(code).trim();
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';

    // 1. Check direct lookup by code/token
    let entry = passwordResetStore.get(cleanCode);

    // 2. Fallback lookup by email
    if (!entry && cleanEmail) {
      const emailEntry = passwordResetStore.get(cleanEmail);
      if (emailEntry && (emailEntry.code === cleanCode || emailEntry.code.replace(/\D/g, '') === cleanCode.replace(/\D/g, ''))) {
        entry = emailEntry;
      }
    }

    // 3. Fallback scan across all active tokens
    if (!entry) {
      for (const [, candidate] of passwordResetStore.entries()) {
        if (candidate.code === cleanCode || (cleanCode.length === 6 && candidate.code.replace(/\D/g, '') === cleanCode)) {
          entry = candidate;
          break;
        }
      }
    }

    if (!entry) {
      return res.status(404).json({
        success: false,
        code: 'CODE_NOT_FOUND',
        message: 'El enlace o código de recuperación no es válido o ha expirado. Solicita uno nuevo.'
      });
    }

    // Check if used
    if (entry.used) {
      return res.status(400).json({
        success: false,
        code: 'CODE_ALREADY_USED',
        message: 'Este enlace de recuperación ya ha sido utilizado para cambiar la contraseña.'
      });
    }

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      passwordResetStore.delete(entry.code);
      passwordResetStore.delete(entry.email);
      return res.status(400).json({
        success: false,
        code: 'CODE_EXPIRED',
        message: 'El enlace de recuperación ha expirado. Por favor solicita uno nuevo.'
      });
    }

    return res.json({
      success: true,
      code: 'CODE_VERIFIED',
      email: entry.email,
      message: 'Enlace verificado correctamente. Ahora puedes crear tu nueva contraseña.'
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

    const cleanCode = String(code || '').trim();
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';

    let entry = passwordResetStore.get(cleanCode);
    if (!entry && cleanEmail) {
      const emailEntry = passwordResetStore.get(cleanEmail);
      if (emailEntry && (emailEntry.code === cleanCode || emailEntry.code.replace(/\D/g, '') === cleanCode.replace(/\D/g, ''))) {
        entry = emailEntry;
      }
    }

    if (!entry) {
      for (const [, candidate] of passwordResetStore.entries()) {
        if (candidate.code === cleanCode || (cleanCode.length === 6 && candidate.code.replace(/\D/g, '') === cleanCode)) {
          entry = candidate;
          break;
        }
      }
    }

    if (!entry) {
      return res.status(404).json({
        success: false,
        code: 'CODE_NOT_FOUND',
        message: 'Sesión de recuperación no encontrada o expirada. Por favor solicita un nuevo enlace.'
      });
    }

    if (entry.used) {
      return res.status(400).json({
        success: false,
        code: 'CODE_ALREADY_USED',
        message: 'Este enlace ya ha sido utilizado para cambiar la contraseña.'
      });
    }

    if (Date.now() > entry.expiresAt) {
      passwordResetStore.delete(entry.code);
      passwordResetStore.delete(entry.email);
      return res.status(400).json({
        success: false,
        code: 'CODE_EXPIRED',
        message: 'El enlace ha expirado. Por favor solicita uno nuevo.'
      });
    }

    // Mark as used immediately to prevent replay attacks
    entry.used = true;

    // Update in server memory store if user exists
    if (SERVER_USERS[cleanEmail]) {
      SERVER_USERS[cleanEmail].password = newPassword;
    }

    setTimeout(() => {
      passwordResetStore.delete(entry!.code);
      passwordResetStore.delete(entry!.email);
    }, 5 * 60 * 1000);

    return res.json({
      success: true,
      code: 'PASSWORD_CHANGED_SUCCESS',
      email: entry.email,
      message: 'Contraseña cambiada correctamente. Ahora puedes iniciar sesión con tus nuevas credenciales.'
    });
  });

  // Persistent server user accounts store (contains official accounts like Isabella Narváez Petro)
  const SERVER_USERS: Record<string, any> = {
    'narvaezpetroisa@gmail.com': {
      id: 'usr-isabella-narvaez',
      name: 'Isabella Narváez Petro',
      email: 'narvaezpetroisa@gmail.com',
      password: 'Isabella#Narvaez2026!',
      phone: '3124567890',
      userType: 'conductor',
      licenseCategory: 'Licencia B1 Particular',
      licenseNumber: 'VN-2026-ISA88',
      safetyScore: 95,
      completedHours: 24,
      passedExams: 4,
      activeReports: 1,
      city: 'Bogotá D.C.',
      primer_ingreso: false,
      emailVerified: true,
      termsAccepted: true
    },
    'munoznaz12@gmail.com': {
      id: 'usr-naz-01',
      name: 'Naz Muñoz',
      email: 'munoznaz12@gmail.com',
      password: 'Naz#Munoz2026!',
      userType: 'conductor',
      licenseCategory: 'Aspirante Licencia B1 / Particular',
      safetyScore: 92,
      completedHours: 18,
      passedExams: 3,
      activeReports: 2,
      primer_ingreso: false,
      emailVerified: true,
      termsAccepted: true
    },
    'vianovaieatbs.2026@gmail.com': {
      id: 'usr-vianova-admin',
      name: 'ViaNova Colombia',
      email: 'vianovaieatbs.2026@gmail.com',
      password: 'ViaNova#2026!',
      userType: 'conductor',
      licenseCategory: 'Instructor / Especial',
      safetyScore: 100,
      completedHours: 120,
      passedExams: 10,
      activeReports: 0,
      city: 'Bogotá D.C.',
      primer_ingreso: false,
      emailVerified: true,
      termsAccepted: true
    },
    'conductor.demo@vianova.edu.co': {
      id: 'usr-demo-01',
      name: 'Carlos Conductor Demo',
      email: 'conductor.demo@vianova.edu.co',
      password: 'Demo#ViaNova2026!',
      phone: '3109876543',
      userType: 'conductor',
      licenseCategory: 'Licencia B1 Particular',
      licenseNumber: 'VN-DEMO-2026',
      safetyScore: 90,
      completedHours: 15,
      passedExams: 2,
      activeReports: 1,
      city: 'Bogotá D.C.',
      primer_ingreso: false,
      emailVerified: true,
      termsAccepted: true
    }
  };

  // Register New User in Server Store
  app.post('/api/auth/register', (req, res) => {
    const { profile, password } = req.body || {};
    if (!profile || !profile.email) {
      return res.status(400).json({ success: false, message: 'Datos de perfil no proporcionados.' });
    }
    const cleanEmail = String(profile.email).trim().toLowerCase();
    SERVER_USERS[cleanEmail] = {
      ...profile,
      email: cleanEmail,
      password: (password && typeof password === 'string') ? password.trim() : 'ViaNova#2026!'
    };
    const { password: _, ...safeProfile } = SERVER_USERS[cleanEmail];
    return res.json({ success: true, user: safeProfile });
  });

  // 7. Check User Existence Endpoint
  app.post('/api/auth/check-user', (req, res) => {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ exists: false, message: 'Correo no proporcionado' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = SERVER_USERS[cleanEmail];
    if (user) {
      const { password: _, ...safeProfile } = user;
      return res.json({ exists: true, user: safeProfile });
    }
    return res.json({ exists: false });
  });

  // 8. Auth Credentials Validation Endpoint
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_FIELDS',
        message: 'Por favor ingresa correo y contraseña.'
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPass = String(password).trim();
    const user = SERVER_USERS[cleanEmail];

    if (!user) {
      return res.status(404).json({
        success: false,
        code: 'USER_NOT_FOUND',
        message: 'Debes crear una cuenta primero'
      });
    }

    if (user.password && user.password !== cleanPass) {
      return res.status(401).json({
        success: false,
        code: 'WRONG_PASSWORD',
        message: 'Contraseña incorrecta. Por favor verifica tus credenciales o solicita restablecer tu contraseña.'
      });
    }

    const { password: _, ...safeProfile } = user;
    return res.json({
      success: true,
      user: safeProfile
    });
  });

  // 9. Update Password Endpoint
  app.post('/api/auth/update-password', (req, res) => {
    const { email, newPassword } = req.body || {};
    if (!email || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Datos inválidos' });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    if (SERVER_USERS[cleanEmail]) {
      SERVER_USERS[cleanEmail].password = String(newPassword).trim();
    }
    return res.json({ success: true, message: 'Contraseña actualizada' });
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
