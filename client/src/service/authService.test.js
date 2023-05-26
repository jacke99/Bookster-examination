import { loginUser } from "./authService";

test("Check if login function is working", async () => {
  const credentials = { username: "Bob", password: "123" };
  const login = await loginUser(credentials);

  expect(login.message).toBe("Successfully signed in");
});
