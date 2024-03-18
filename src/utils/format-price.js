export const formatPrice = (price) => {
  const defaultCurrency = JSON.parse(localStorage.defaultCurrency);
  return `${price.toFixed(2)} ${defaultCurrency?.symbol}`;
};
