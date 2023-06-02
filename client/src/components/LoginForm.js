import { Form } from "react-router-dom";

export default function LoginForm() {
  return (
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
  );
}
