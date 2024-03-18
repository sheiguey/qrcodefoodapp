import { BASE_URL } from "../config/site-settings";

export const callRequest = async (data) => {
  const res = await fetch(`${BASE_URL}v1/rest/notifications`, {
    headers: { "Content-type": "application/json" },
    method: "POST",
    body: JSON.stringify(data),
  });
  if (res.status === 200) {
    return res.json();
  }
  throw Error;
};
