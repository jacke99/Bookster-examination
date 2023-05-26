import { performRequest } from "./fetchService";

export async function actionEdit(previous, current) {
  const resp = await performRequest(
    "http://127.0.0.1:4000/admin/books",
    "PUT",
    { previous, current }
  );
  console.log(resp);
  const data = await resp.json();

  return data;
}

export async function actionDelete(title) {
  const resp = await performRequest(
    "http://127.0.0.1:4000/admin/books",
    "DELETE",
    { title }
  );
  const data = await resp.json();
  console.log(data);
  return data;
}
