import type {
  Product,
  ProductApiResponse,
  SearchFilters,
} from "~/types/product";
import { mockProducts, categories } from "~/data/mockProducts";

export class ProductService {
  private products: Product[] = mockProducts;

  async getAllProducts(
    page: number = 1,
    limit: number = 50
  ): Promise<ProductApiResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = this.products.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total: this.products.length,
      page,
      limit,
    };
  }

  async searchProducts(
    filters: SearchFilters,
    page: number = 1,
    limit: number = 50
  ): Promise<ProductApiResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 150));

    let filteredProducts = [...this.products];

    // Apply search query filter
    if (filters.query && filters.query.trim()) {
      const query = filters.query.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== "All") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === filters.category
      );
    }

    // Apply price range filter
    if (filters.minPrice !== undefined && filters.minPrice >= 0) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= filters.minPrice!
      );
    }

    if (filters.maxPrice !== undefined && filters.maxPrice >= 0) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= filters.maxPrice!
      );
    }

    // Apply stock filter
    if (filters.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.inStock === filters.inStock
      );
    }

    // Apply rating filter
    if (filters.minRating !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.rating >= filters.minRating!
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      limit,
    };
  }

  async getProductById(id: string): Promise<Product | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    const product = this.products.find((p) => p.id === id);
    return product || null;
  }

  async getCategories(): Promise<string[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    return [...categories];
  }
}
