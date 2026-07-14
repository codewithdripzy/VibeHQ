import { Resend } from "resend";
import { configDotenv } from "dotenv";

configDotenv();

type EmailCta = {
  label: string;
  url: string;
  tone?: "dark" | "green" | "red";
};

type EmailLayoutOptions = {
  eyebrow?: string;
  title: string;
  intro?: string;
  body: string;
  footer?: string;
  accent?: string;
  cta?: EmailCta;
};

class EmailService {
  private resend: Resend | null = null;
  private defaultFrom = "VibeHQ <noreply@vibehq.ai>";

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      console.warn("RESEND_API_KEY is not defined in the environment. EmailService will log emails to console.");
    }
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  private buildLayout({ eyebrow, title, intro, body, footer, accent = "#111827", cta }: EmailLayoutOptions) {
    const ctaColor = cta?.tone === "green" ? "#059669" : cta?.tone === "red" ? "#e11d48" : "#111827";
    return `
      <div style="margin:0; padding:0; background:linear-gradient(180deg,#f8fafc 0%,#ffffff 100%);">
        <div style="max-width: 680px; margin: 0 auto; padding: 32px 16px; font-family: Inter, 'Segoe UI', Helvetica, Arial, sans-serif; color: #111827;">
          <div style="overflow:hidden; border: 1px solid #e5e7eb; border-radius: 24px; background: #ffffff; box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);">
            <div style="padding: 28px 32px; background: linear-gradient(135deg, ${accent} 0%, rgba(17,24,39,0.86) 100%); color: #ffffff;">
              <div style="font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.82;">VibeHQ</div>
              <div style="margin-top: 8px; font-size: 26px; line-height: 1.15; font-weight: 700;">${this.escapeHtml(title)}</div>
            </div>
            <div style="padding: 32px;">
              ${eyebrow ? `<div style="display:inline-block; padding: 6px 12px; border-radius: 999px; background: #f3f4f6; color: #6b7280; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;">${this.escapeHtml(eyebrow)}</div>` : ""}
              ${intro ? `<p style="margin: 20px 0 0; color: #374151; font-size: 15px; line-height: 1.7;">${intro}</p>` : ""}
              <div style="margin-top: 24px; color: #111827; font-size: 15px; line-height: 1.75;">${body}</div>
              ${cta ? `
                <div style="margin-top: 28px; text-align: center;">
                  <a href="${cta.url}" style="display:inline-block; background:${ctaColor}; color:#ffffff; text-decoration:none; padding: 12px 22px; border-radius: 999px; font-size: 14px; font-weight: 700;">${this.escapeHtml(cta.label)}</a>
                </div>
              ` : ""}
            </div>
            <div style="padding: 18px 32px 24px; border-top: 1px solid #e5e7eb; background: #fafafa; color: #6b7280; font-size: 12px; line-height: 1.6;">
              ${this.escapeHtml(footer || "You're receiving this because an important VibeHQ activity involved your account.")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (this.resend) {
      try {
        const data = await this.resend.emails.send({
          from: this.defaultFrom,
          to: [to],
          subject,
          html,
        });
        console.log(`Email sent to ${to} (Subject: "${subject}")`, data);
        return data;
      } catch (err) {
        console.error(`Failed to send email to ${to}`, err);
        throw err;
      }
    } else {
      console.log(`[MOCK EMAIL] To: ${to} | Subject: "${subject}"`);
      return { mock: true, success: true };
    }
  }

  async sendWelcomeEmail(email: string, name: string) {
    const subject = "Welcome to VibeHQ";
    const html = this.buildLayout({
      eyebrow: "Welcome",
      title: "Your AI company is ready",
      intro: `Hi ${this.escapeHtml(name)},`,
      body: `
        <p style="margin: 0 0 12px;">Your VibeHQ account is active and ready.</p>
        <p style="margin: 0;">You can now create your first AI company, hire autonomous agents, and start building.</p>
      `,
      cta: { label: "Open dashboard", url: "https://vibehq.ai/dashboard" },
      footer: "If you did not create this account, ignore this email."
    });
    return this.sendEmail(email, subject, html);
  }

  async sendAccountVerificationEmail(email: string, name: string) {
    const subject = "Verify your VibeHQ account";
    const html = this.buildLayout({
      eyebrow: "Account verification",
      title: "Confirm your email address",
      intro: `Hi ${this.escapeHtml(name)},`,
      body: `
        <p style="margin: 0 0 12px;">Your VibeHQ account is ready and waiting for email verification.</p>
        <p style="margin: 0;">Once verification is complete, you can start building autonomous AI companies.</p>
      `,
      cta: { label: "Open dashboard", url: "https://vibehq.ai/dashboard" },
      footer: "This is an automated verification notice from VibeHQ."
    });
    return this.sendEmail(email, subject, html);
  }

  async sendTwoFactorAuthCode(email: string, code: string) {
    const subject = `${code} is your VibeHQ Verification Code`;
    const html = this.buildLayout({
      eyebrow: "Security",
      title: "Verification code",
      body: `
        <p style="margin: 0 0 16px;">Use this code to complete your VibeHQ action.</p>
        <div style="text-align: center; margin: 24px 0;">
          <div style="display:inline-block; padding: 16px 28px; border-radius: 16px; background: #f3f4f6; letter-spacing: 0.18em; font-size: 28px; font-weight: 800; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;">${this.escapeHtml(code)}</div>
        </div>
        <p style="margin: 0;">The code expires in 10 minutes. If you did not request it, ignore this email and secure your account.</p>
      `,
      footer: "VibeHQ security notices are time-sensitive and should only be used by the account owner."
    });
    return this.sendEmail(email, subject, html);
  }

  async sendSecurityAlert(email: string, settingName: string, changeTime: string) {
    const subject = "Security Alert: Changes on your VibeHQ Account";
    const html = this.buildLayout({
      eyebrow: "Security alert",
      title: "Account settings changed",
      body: `
        <p style="margin: 0 0 8px;"><strong>Action:</strong> ${this.escapeHtml(settingName)}</p>
        <p style="margin: 0 0 16px;"><strong>Time:</strong> ${this.escapeHtml(changeTime)}</p>
        <p style="margin: 0;">If you did not authorize this update, review your account immediately and secure it.</p>
      `,
      cta: { label: "Review security", url: "https://vibehq.ai/dashboard/settings", tone: "red" },
      footer: "VibeHQ trust and safety notifications are sent when your account changes."
    });
    return this.sendEmail(email, subject, html);
  }
}

export default new EmailService();
