import { render } from "@react-email/render";
import resend from "../config/resend";
import { DeliveryData } from "../jobs/reel";
import VerificationEmail from "../../../emails/verification";
import ResetPasswordEmail from "../../../emails/reset-password";
import ReelConfirmationEmail from "../../../emails/reel-confirmation";
import ReelDeliveryEmail from "../../../emails/reel-delivery";

const FROM = "Ayo from Memoreel <hello@usegivva.dev>";

class EmailService {
  async verificationEmail(email: string, token: string) {
    const link = `${process.env.CLIENT_URL}/auth/verify?token=${token}`;
    const html = await render(VerificationEmail({ link }));

    return await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Verify Your Email",
      html,
    });
  }

  async resetPasswordEmail(email: string, token: string) {
    const link = `${process.env.CLIENT_URL}/auth/reset-password?token=${token}`;
    const html = await render(ResetPasswordEmail({ link }));

    return await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Reset your password",
      html,
    });
  }

  async reelConfirmationEmail(email: string, token: string) {
    const link = `${process.env.CLIENT_URL}/reels/confirm?token=${token}`;
    const html = await render(ReelConfirmationEmail({ link }));

    return await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Reel Confirmation",
      html,
    });
  }

  async reelDeliveryEmail(email: string, data: DeliveryData) {
    const html = await render(ReelDeliveryEmail(data));

    return await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Your Reel Has Arrived",
      html,
    });
  }
}

export default new EmailService();
