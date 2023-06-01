/**Register component
 * This component is used to create a new account
 * This component uses a custom action when the Form is submitted
 * If the user enters invalid credentials an error message is displayed.
 */

import { Form, Link, redirect, useActionData } from "react-router-dom";
import { registerUser } from "../service/authService";

export async function action({ request }) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  if (username === "" || password === "") {
    return "Please enter both username and passowrd";
  }
  console.log(username, password);
  const data = await registerUser({ username, password });

  if (data.message) {
    return redirect("/login");
  } else if (data.error) {
    return data.error;
  }
}

export default function Register() {
  const errorMessage = useActionData();
  return (
    <div className="login-container">
      <h2 className="login-title">Register</h2>
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
          Sign up
        </button>
      </Form>
      <p>
        Already have an account? Sign in{" "}
        <Link className="link-text" to="/login">
          here
        </Link>
      </p>
    </div>
  );
}
