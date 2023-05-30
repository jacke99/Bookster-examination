import { loginUser } from "./authService";
import { parseJwt } from "./jwtService";

test("Check if jwt decoder is working", async () => {
  const resp = await loginUser({ username: "Bob", password: "123" });
  const decoded = parseJwt(resp.accessToken);

  expect(decoded.username).toBe("Bob");
});
