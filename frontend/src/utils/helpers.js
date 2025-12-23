export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const isLowStock = (product) => {
  return product.currentStock <= product.minStock;
};

export const calculateTotalValue = (products) => {
  return products.reduce((total, product) => {
    return total + product.currentStock * product.price;
  }, 0);
};

export const groupByCategory = (products) => {
  return products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});
};
