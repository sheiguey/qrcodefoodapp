import { BASE_URL } from "../config/site-settings";

export const createOrderRequest = async (data) => {
  const res = await fetch(`${BASE_URL}v1/rest/orders`, {
    headers: { "Content-type": "application/json" },
    method: "POST",
    body: JSON.stringify(data),
  });
  if (res.status === 200) {
    return res.json();
  }
  throw Error;
};

export const updateOrderRequest =async (id, data) => {
  const res = await fetch(`${BASE_URL}v1/rest/orders/update-tips/${id}`, {
    headers: { "Content-type": "application/json" },
    method: "POST",
    body: JSON.stringify(data),
  });
  if (res.status === 200) {
    return res.json();
  }
  throw Error;
}; 
