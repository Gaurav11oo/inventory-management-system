import api from "./api";

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data.data;
};

export const createProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const updateStock = async (id, operation, quantity) => {
  const response = await api.patch(`/products/${id}/stock`, {
    operation,
    quantity,
  });
  return response.data.data;
};

export const getLowStockProducts = async () => {
  const response = await api.get("/products/lowstock");
  return response.data.data;
};
