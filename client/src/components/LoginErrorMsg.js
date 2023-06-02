export default function LoginErrorMsg({ errorMessage }) {
  return (
    <>
      {errorMessage ? (
        <p data-testid="err-msg" className="login-error">
          {errorMessage}{" "}
        </p>
      ) : (
        <p className="hidden-error">|</p>
      )}
    </>
  );
}
