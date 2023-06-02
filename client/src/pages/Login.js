/**Log in component
 * This component uses a custom action when the Form is submitted
 * If the user enters valid credentials, a JWT will be stored in sessionstorage and navigates the user to the page corresponding to their role.
 * If the user enters invalid credentials an error message is displayed.
 */

import { Link, redirect, useActionData, useNavigate } from "react-router-dom";
import { loginUser } from "../service/authService";
import { parseJwt } from "../service/jwtService";
import LoginForm from "../components/LoginForm";
import LoginErrorMsg from "../components/LoginErrorMsg";

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
      <LoginErrorMsg errorMessage={errorMessage} />
      <LoginForm />
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
