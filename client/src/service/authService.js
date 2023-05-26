import { performRequest } from "./fetchService";

export async function loginUser(credentials) {
  let resp = await performRequest(
    "http://127.0.0.1:4000/auth/login",
    "POST",
    credentials
  );
  const data = await resp.json();
  console.log(data);

  if (!resp.ok) {
    //eslint-disable-next-line
    throw {
      message: data.error,
      status: data.status,
    };
  }

  return data;
}
