import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ProductDashboard } from "../ProductDashboard";
import { CartProvider } from "~/context/CartContext";
import { Provider } from "~/components/ui/provider";
import { ProductService } from "~/services/productService";
import type { Product } from "~/types/product";

// Mock ProductService
vi.mock("~/services/productService");
const mockProductService = vi.mocked(ProductService);

// Mock products for testing
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Laptop Pro",
    price: 1299.99,
    description: "High-performance laptop",
    category: "electronics",
    image: "laptop.jpg",
    rating: 4.5,
    reviewCount: 25,
    inStock: true,
    tags: ["electronics", "laptop", "computer"],
  },
  {
    id: "2",
    name: "Coffee Maker",
    price: 89.99,
    description: "Premium coffee maker",
    category: "appliances",
    image: "coffee.jpg",
    rating: 4.0,
    reviewCount: 12,
    inStock: true,
    tags: ["appliances", "coffee", "kitchen"],
  },
];

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider>
    <CartProvider>{children}</CartProvider>
  </Provider>
);

describe("ProductDashboard", () => {
  let mockProductServiceInstance: any;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Create mock service instance
    mockProductServiceInstance = {
      searchProducts: vi.fn(),
      getAllProducts: vi.fn(),
    };

    mockProductService.mockImplementation(() => mockProductServiceInstance);
  });

  it("renders without crashing", () => {
    mockProductServiceInstance.getAllProducts.mockResolvedValue({
      products: mockProducts,
      total: 2,
      page: 1,
      limit: 50,
    });

    render(
      <TestWrapper>
        <ProductDashboard />
      </TestWrapper>
    );

    expect(screen.getByTestId("product-dashboard")).toBeInTheDocument();
  });

  it("displays loading state initially", () => {
    mockProductServiceInstance.getAllProducts.mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <TestWrapper>
        <ProductDashboard />
      </TestWrapper>
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.getByText("Loading products...")).toBeInTheDocument();
  });

  it("loads and displays products on mount", async () => {
    mockProductServiceInstance.getAllProducts.mockResolvedValue({
      products: mockProducts,
      total: 2,
      page: 1,
      limit: 50,
    });

    render(
      <TestWrapper>
        <ProductDashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Laptop Pro")).toBeInTheDocument();
      expect(screen.getByText("Coffee Maker")).toBeInTheDocument();
    });

    expect(mockProductServiceInstance.getAllProducts).toHaveBeenCalledTimes(1);
  });

  it("displays error message when product loading fails", async () => {
    const errorMessage = "Failed to load products";
    mockProductServiceInstance.getAllProducts.mockRejectedValue(
      new Error(errorMessage)
    );

    render(
      <TestWrapper>
        <ProductDashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByText("Error loading products")).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("includes retry functionality on error", async () => {
    mockProductServiceInstance.getAllProducts
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        products: mockProducts,
        total: 2,
        page: 1,
        limit: 50,
      });

    render(
      <TestWrapper>
        <ProductDashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Error loading products")).toBeInTheDocument();
    });

    const retryButton = screen.getByRole("button", { name: /retry/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText("Laptop Pro")).toBeInTheDocument();
    });

    expect(mockProductServiceInstance.getAllProducts).toHaveBeenCalledTimes(2);
  });

  it("renders search bar component", async () => {
    mockProductServiceInstance.getAllProducts.mockResolvedValue({
      products: mockProducts,
      total: 2,
      page: 1,
      limit: 50,
    });

    render(
      <TestWrapper>
        <ProductDashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/search products/i)
      ).toBeInTheDocument();
    });
  });

  it("handles search functionality", async () => {
    const searchResults = [mockProducts[0]];
    mockProductServiceInstance.getAllProducts.mockResolvedValue({
      products: mockProducts,
      total: 2,
      page: 1,
      limit: 50,
    });
    mockProductServiceInstance.searchProducts.mockResolvedValue({
      products: searchResults,
      total: 1,
      page: 1,
      limit: 50,
    });

    render(
      <TestWrapper>
        <ProductDashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Coffee Maker")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(searchInput, { target: { value: "laptop" } });

    await waitFor(() => {
      expect(mockProductServiceInstance.searchProducts).toHaveBeenCalledWith(
        expect.objectContaining({ query: "laptop" })
      );
    });
  });

  it("displays product count", async () => {
    mockProductServiceInstance.getAllProducts.mockResolvedValue({
      products: mockProducts,
      total: 2,
      page: 1,
      limit: 50,
    });

    render(
      <TestWrapper>
        <ProductDashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("2 products found")).toBeInTheDocument();
    });
  });

  it("displays empty state when no products found", async () => {
    mockProductServiceInstance.getAllProducts.mockResolvedValue({
      products: [],
      total: 0,
      page: 1,
      limit: 50,
    });

    render(
      <TestWrapper>
        <ProductDashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
      expect(screen.getByText("No products found")).toBeInTheDocument();
    });
  });

  it("displays cart button in header", async () => {
    mockProductServiceInstance.getAllProducts.mockResolvedValue({
      products: mockProducts,
      total: 2,
      page: 1,
      limit: 50,
    });

    render(
      <TestWrapper>
        <ProductDashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cart-button")).toBeInTheDocument();
    });
  });

  it("has responsive grid layout", async () => {
    mockProductServiceInstance.getAllProducts.mockResolvedValue({
      products: mockProducts,
      total: 2,
      page: 1,
      limit: 50,
    });

    render(
      <TestWrapper>
        <ProductDashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      const productGrid = screen.getByTestId("product-grid");
      expect(productGrid).toBeInTheDocument();
    });
  });

  it("displays cart item count in cart button", async () => {
    mockProductServiceInstance.getAllProducts.mockResolvedValue({
      products: mockProducts,
      total: 2,
      page: 1,
      limit: 50,
    });

    render(
      <TestWrapper>
        <ProductDashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      const cartButton = screen.getByTestId("cart-button");
      expect(cartButton).toBeInTheDocument();
    });

    // Add item to cart by clicking add button on product card
    const addButtons = screen.getAllByText("Add to Cart");
    fireEvent.click(addButtons[0]);

    await waitFor(() => {
      const cartButton = screen.getByTestId("cart-button");
      const badge = cartButton.querySelector('[class*="badge"]') || cartButton;
      expect(badge).toHaveTextContent("1");
    });
  });
});
