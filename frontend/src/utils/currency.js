export const FREE_SHIPPING_THRESHOLD = 5000;
export const STANDARD_SHIPPING_COST = 500;
export const TAX_RATE = 0.1;

export const formatCurrency = (amount) => {
  const value = Number(amount) || 0;
  const formatted = new Intl.NumberFormat('en-KE', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

  return `KSh ${formatted}`;
};
