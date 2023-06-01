import { DeliveryData } from "../jobs/reel";
import mailgun, { mgDomain } from "../config/mailgun";

interface MailOptions {
  email: string;
  subject: string;
  template:
    | "verification"
    | "reel-confirmation"
    | "reel-delivery"
    | "welcome"
    | "reset-password";
  variables?: any;
}

class EmailService {
  private async sendMail(options: MailOptions) {
    return await mailgun.messages.create(mgDomain, {
      to: options.email,
      subject: options.subject,
      template: options.template,
      from: "Ayo from Memoreel <pupoawe@icloud.com>",
      "t:variables": JSON.stringify(options.variables),
    });
  }

  async verificationEmail(email: string, token: string) {
    const options: MailOptions = {
      email,
      subject: "Verify Your Email",
      template: "verification",
      variables: {
        link: `${process.env.CLIENT_URL}/auth/verify?token=${token}`,
      },
    };

    return await this.sendMail(options);
  }

  async resetPasswordEmail(email: string, token: string) {
    const options: MailOptions = {
      email,
      subject: "Reset your password",
      template: "reset-password",
      variables: {
        link: `${process.env.CLIENT_URL}/auth/reset-password?token=${token}`,
      },
    };

    return await this.sendMail(options);
  }

  async reelConfirmationEmail(email: string, token: string) {
    const options: MailOptions = {
      email,
      subject: "Reel Confirmation",
      template: "reel-confirmation",
      variables: {
        link: `${process.env.CLIENT_URL}/reels/confirm?token=${token}`,
      },
    };

    return await this.sendMail(options);
  }

  async reelDeliveryEmail(email: string, data: DeliveryData) {
    const options: MailOptions = {
      email,
      subject: "Your Reel Has Arrived",
      template: "reel-delivery",
      variables: data,
    };

    return await this.sendMail(options);
  }
}

export default new EmailService();
