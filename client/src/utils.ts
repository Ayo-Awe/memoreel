export function formatLoginErrors(errorCode: string, email: string) {
  switch (errorCode) {
    case "INVALID_REQUEST_PARAMETERS":
    case "RESOURCE_NOT_FOUND":
      return {
        title: "Invalid email/password",
        description: "Email or password is invalid",
      };
    case "USER_NOT_VERIFIED":
      return {
        title: "Email not verified",
        description: `To proceed, please verify your email. An email was sent to ${email}.`,
      };
    default:
      return { description: "An unexpected error occured", title: "Error" };
  }
}
