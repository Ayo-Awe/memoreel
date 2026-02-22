import Agenda, { Job } from "agenda";
import emailService from "../services/email";

export interface EmailJobData {
  type: "verification" | "reset-password" | "reel-confirmation" | "reel-delivery";
  email: string;
  variables: Record<string, any>;
}

export default function (agenda: Agenda) {
  agenda.define<EmailJobData>("send-email", async (job: Job<EmailJobData>) => {
    const { type, email, variables } = job.attrs.data;

    switch (type) {
      case "verification":
        await emailService.verificationEmail(email, variables.token);
        break;
      case "reset-password":
        await emailService.resetPasswordEmail(email, variables.token);
        break;
      case "reel-confirmation":
        await emailService.reelConfirmationEmail(email, variables.token);
        break;
      case "reel-delivery":
        await emailService.reelDeliveryEmail(email, variables as any);
        break;
    }
  });
}
