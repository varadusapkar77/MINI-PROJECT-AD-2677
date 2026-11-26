import { USD_TO_INR } from "../config/appConfig";

export const API = "https://dummyjson.com";

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail?: string;
  rating?: number;
  brand?: string;
  stock?: number;
};

// API prices are in USD, convert to INR
const inr = (p: Product): Product => ({
  ...p,
  price: Math.round(p.price * USD_TO_INR),
});

async function request(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error("Server error " + res.status);
  return res.json();
}

// GET
export const getProducts = async (): Promise<Product[]> =>
  (await request(`${API}/products?limit=40`)).products.map(inr);

export const searchProducts = async (q: string): Promise<Product[]> =>
  (await request(`${API}/products/search?q=${encodeURIComponent(q)}`)).products.map(inr);

export const getCategories = async (): Promise<string[]> =>
  request(`${API}/products/category-list`);

export const getByCategory = async (c: string): Promise<Product[]> =>
  (await request(`${API}/products/category/${encodeURIComponent(c)}`)).products.map(inr);

export const getProduct = async (id: number): Promise<Product> =>
  inr(await request(`${API}/products/${id}`));

// POST
export const createProduct = (data: Partial<Product>): Promise<Product> =>
  request(`${API}/products/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// DELETE
export const deleteProductApi = (id: number) =>
  request(`${API}/products/${id}`, { method: "DELETE" });