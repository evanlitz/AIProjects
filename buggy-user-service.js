// User service with a hidden bug
class UserService {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    // Handle optional email (e.g., OAuth users)
    const normalizedEmail = user.email?.toLowerCase() ?? null;
    this.users.push({
      ...user,
      email: normalizedEmail,
    });
  }

  findUserByEmail(email) {
    if (!email) return null;
    return this.users.find((u) => u.email === email.toLowerCase());
  }
}

module.exports = UserService;
