import { describe, it, expect } from "vitest";
import { ProductService } from "../productService";
import type { SearchFilters } from "~/types/product";

describe("ProductService", () => {
  const productService = new ProductService();

  describe("getAllProducts", () => {
    it("should return all products when no filters applied", async () => {
      const result = await productService.getAllProducts();

      expect(result.products).toBeDefined();
      expect(result.products.length).toBeGreaterThan(0);
      expect(result.total).toBe(result.products.length);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(50);
    });

    it("should return paginated results", async () => {
      const result = await productService.getAllProducts(1, 5);

      expect(result.products.length).toBe(5);
      expect(result.limit).toBe(5);
      expect(result.page).toBe(1);
    });

    it("should return empty array for page beyond available data", async () => {
      const result = await productService.getAllProducts(10, 50);

      expect(result.products.length).toBe(0);
      expect(result.page).toBe(10);
    });
  });

  describe("searchProducts", () => {
    it("should return products matching search query", async () => {
      const filters: SearchFilters = { query: "headphones" };
      const result = await productService.searchProducts(filters);

      expect(result.products.length).toBeGreaterThan(0);
      result.products.forEach((product) => {
        expect(
          product.name.toLowerCase().includes("headphones") ||
            product.description.toLowerCase().includes("headphones") ||
            product.tags.some((tag) => tag.toLowerCase().includes("headphones"))
        ).toBe(true);
      });
    });

    it("should return products matching category filter", async () => {
      const filters: SearchFilters = { query: "", category: "Electronics" };
      const result = await productService.searchProducts(filters);

      expect(result.products.length).toBeGreaterThan(0);
      result.products.forEach((product) => {
        expect(product.category).toBe("Electronics");
      });
    });

    it("should return products within price range", async () => {
      const filters: SearchFilters = { query: "", minPrice: 50, maxPrice: 100 };
      const result = await productService.searchProducts(filters);

      result.products.forEach((product) => {
        expect(product.price).toBeGreaterThanOrEqual(50);
        expect(product.price).toBeLessThanOrEqual(100);
      });
    });

    it("should filter by stock status", async () => {
      const filters: SearchFilters = { query: "", inStock: true };
      const result = await productService.searchProducts(filters);

      result.products.forEach((product) => {
        expect(product.inStock).toBe(true);
      });
    });

    it("should filter by minimum rating", async () => {
      const filters: SearchFilters = { query: "", minRating: 4.5 };
      const result = await productService.searchProducts(filters);

      result.products.forEach((product) => {
        expect(product.rating).toBeGreaterThanOrEqual(4.5);
      });
    });

    it("should combine multiple filters", async () => {
      const filters: SearchFilters = {
        query: "wireless",
        category: "Electronics",
        minPrice: 30,
        maxPrice: 200,
        inStock: true,
        minRating: 4.0,
      };
      const result = await productService.searchProducts(filters);

      result.products.forEach((product) => {
        expect(product.category).toBe("Electronics");
        expect(product.price).toBeGreaterThanOrEqual(30);
        expect(product.price).toBeLessThanOrEqual(200);
        expect(product.inStock).toBe(true);
        expect(product.rating).toBeGreaterThanOrEqual(4.0);
        expect(
          product.name.toLowerCase().includes("wireless") ||
            product.description.toLowerCase().includes("wireless") ||
            product.tags.some((tag) => tag.toLowerCase().includes("wireless"))
        ).toBe(true);
      });
    });

    it("should return empty result for non-matching query", async () => {
      const filters: SearchFilters = { query: "nonexistentproduct123" };
      const result = await productService.searchProducts(filters);

      expect(result.products.length).toBe(0);
      expect(result.total).toBe(0);
    });
  });

  describe("getProductById", () => {
    it("should return product by valid id", async () => {
      const product = await productService.getProductById("1");

      expect(product).toBeDefined();
      expect(product?.id).toBe("1");
      expect(product?.name).toBeDefined();
      expect(product?.price).toBeGreaterThan(0);
    });

    it("should return null for invalid id", async () => {
      const product = await productService.getProductById("invalid-id");

      expect(product).toBeNull();
    });
  });

  describe("getCategories", () => {
    it("should return list of categories", async () => {
      const categories = await productService.getCategories();

      expect(categories).toBeDefined();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain("Electronics");
      expect(categories).toContain("Kitchen");
    });
  });

  describe("error handling", () => {
    it("should handle service errors gracefully", async () => {
      // This test ensures the service handles edge cases
      const filters: SearchFilters = {
        query: "",
        minPrice: -1,
        maxPrice: -10,
      };

      await expect(
        productService.searchProducts(filters)
      ).resolves.toBeDefined();
    });
  });
});
