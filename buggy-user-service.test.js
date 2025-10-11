// Test suite for UserService
const UserService = require("./buggy-user-service");

describe("UserService", () => {
  let service;

  beforeEach(() => {
    service = new UserService();
  });

  test("should handle users with email", () => {
    const user = { id: 1, name: "Bob", email: "BOB@EXAMPLE.COM" };
    service.addUser(user);
    const found = service.findUserByEmail("bob@example.com");
    expect(found).toBeDefined();
    expect(found.email).toBe("bob@example.com");
  });

  test("should handle users without email (OAuth users)", () => {
    const user = { id: 2, name: "Alice", email: null };
    expect(() => service.addUser(user)).not.toThrow();
  });

  test("should handle undefined email", () => {
    const user = { id: 3, name: "Charlie", email: undefined };
    expect(() => service.addUser(user)).not.toThrow();
  });
});
