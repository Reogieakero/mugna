export class AdminModel {
  static validateCredentials(username: string, password: string) {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      throw new Error("Admin credentials are not set in the environment variables");
    }

    const isValid =
      username === adminUsername && password === adminPassword;

    return isValid;
  }
}
