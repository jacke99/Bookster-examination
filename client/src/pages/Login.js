/**Log in component
 * This component uses a custom action when the Form is submitted
 * If the user enters valid credentials, a JWT will be stored in sessionstorage and navigates the user to the page corresponding to their role.
 * If the user enters invalid credentials an error message is displayed.
 */

import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigate,
} from "react-router-dom";
import { loginUser } from "../service/authService";
import { parseJwt } from "../service/jwtService";

export async function action({ request }) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  console.log(username, password);

  try {
    const data = await loginUser({ username, password });
    console.log(data);
    sessionStorage.setItem("Authtoken", data.accessToken);
    const decoded = parseJwt(data.accessToken);
    console.log(decoded);
    if (decoded.role === "ADMIN") {
      return redirect("/admin");
    }
    return redirect("/user");
  } catch (err) {
    return err.message;
  }
}

export default function Login() {
  const errorMessage = useActionData();
  const navigate = useNavigate();
  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {errorMessage ? (
        <p data-testid="err-msg" className="login-error">
          {errorMessage}
        </p>
      ) : (
        <p className="hidden-error">|</p>
      )}
      <Form className="login-form" method="post" replace>
        <input
          data-testid="username-field"
          name="username"
          type="text"
          placeholder="Username..."
        />
        <input
          data-testid="password-field"
          name="password"
          type="password"
          placeholder="Password..."
        />
        <button className="login-btn" data-testid="login-btn">
          Sign in
        </button>
      </Form>
      <button onClick={() => navigate("/")} className="guest-btn">
        Proceed as guest user
      </button>
      <p>
        No account? Sign up{" "}
        <Link className="link-text" to="/register">
          here
        </Link>
      </p>
    </div>
  );
}
