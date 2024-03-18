import { BASE_URL } from "../config/site-settings";

export const fetcher = async (url, options) => {
  const params = new URLSearchParams(options);
  return await fetch(`${url}${options ? `?${params.toString()}` : ""}`, {
    headers: {
      Application: "application/json",
    },
  });
};
