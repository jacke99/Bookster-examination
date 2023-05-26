const fetchOptions = (method, body) => ({
  method: method,
  body: JSON.stringify(body),
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + sessionStorage.getItem("Authtoken"),
  },
});

export const performRequest = async (url, req, body) => {
  const options = fetchOptions(req, body);
  let resp = await fetch(url, options);
  return resp;
};
