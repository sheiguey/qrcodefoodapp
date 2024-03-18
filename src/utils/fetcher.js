import { BASE_URL } from "../config/site-settings";

/* export const fetcher = (url, options) => {
  const params = new URLSearchParams(options);
  return fetch(`${BASE_URL}${url}${options ? `?${params.toString()}` : ""}`, {
    headers: {
      Application: "application/json",
    },
  });
};  */

async function fetcher(url, options) {
  const params = new URLSearchParams(options);
  try {
    const response = await fetch(`${BASE_URL}${url}${options ? `?${params.toString()}` : ""}`, {
      headers: {
        Application: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export {fetcher} 
