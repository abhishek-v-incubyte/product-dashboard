import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Provider } from "~/components/ui/provider";
import { CartProvider } from "~/context/CartContext";
import { ProductDashboard } from "~/components/dashboard/ProductDashboard";
import { ProductService } from "~/services/productService";

// Mock ProductService
vi.mock("~/services/productService");
const mockProductService = vi.mocked(ProductService);

// Integration test wrapper
const IntegrationTestWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Provider>
    <CartProvider>{children}</CartProvider>
  </Provider>
);

describe("Product Dashboard Integration", () => {
  let mockProductServiceInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock service with realistic data
    mockProductServiceInstance = {
      searchProducts: vi.fn(),
      getAllProducts: vi.fn(),
    };

    mockProductService.mockImplementation(() => mockProductServiceInstance);

    // Default mock data
    const mockProducts = [
      {
        id: "1",
        name: "MacBook Pro",
        price: 1999.99,
        description: "Powerful laptop for professionals",
        category: "electronics",
        image: "macbook.jpg",
        rating: 4.8,
        reviewCount: 120,
        inStock: true,
        tags: ["laptop", "apple", "professional"],
      },
      {
        id: "2",
        name: "Coffee Machine",
        price: 299.99,
        description: "Automatic coffee maker",
        category: "appliances",
        image: "coffee.jpg",
        rating: 4.2,
        reviewCount: 85,
        inStock: true,
        tags: ["coffee", "kitchen", "automatic"],
      },
    ];

    mockProductServiceInstance.getAllProducts.mockResolvedValue({
      products: mockProducts,
      total: 2,
      page: 1,
      limit: 50,
    });

    mockProductServiceInstance.searchProducts.mockResolvedValue({
      products: [mockProducts[0]],
      total: 1,
      page: 1,
      limit: 50,
    });
  });

  it("completes full user workflow: load products, search, add to cart, view cart", async () => {
    render(
      <IntegrationTestWrapper>
        <ProductDashboard />
      </IntegrationTestWrapper>
    );

    // 1. Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("MacBook Pro")).toBeInTheDocument();
      expect(screen.getByText("Coffee Machine")).toBeInTheDocument();
    });

    // 2. Verify product count
    expect(screen.getByText("2 products found")).toBeInTheDocument();

    // 3. Add first product to cart
    const addToCartButtons = screen.getAllByText("Add to Cart");
    fireEvent.click(addToCartButtons[0]);

    // 4. Verify cart button shows count
    await waitFor(() => {
      const cartButton = screen.getByTestId("cart-button");
      const badge = cartButton.querySelector('[class*="badge"]');
      expect(badge).toHaveTextContent("1");
    });

    // 5. Open cart drawer
    const cartButton = screen.getByTestId("cart-button");
    fireEvent.click(cartButton);

    // 6. Verify cart contents
    await waitFor(() => {
      expect(screen.getByText("Shopping Cart")).toBeInTheDocument();
      expect(screen.getByTestId(`cart-item-1`)).toBeInTheDocument();
      expect(screen.getAllByText("MacBook Pro")).toHaveLength(2); // One in product list, one in cart
      expect(screen.getByText("$1,999.99 each")).toBeInTheDocument();
    });

    // 7. Verify cart total
    expect(screen.getByText("Total (1 items):")).toBeInTheDocument();
    expect(screen.getByText("$1,999.99")).toBeInTheDocument();

    // 8. Test search functionality
    const closeButton = screen.getByLabelText(/close cart/i);
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("Shopping Cart")).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(searchInput, { target: { value: "macbook" } });

    // 9. Verify search results (mocked to return only MacBook)
    await waitFor(() => {
      expect(mockProductServiceInstance.searchProducts).toHaveBeenCalledWith(
        expect.objectContaining({ query: "macbook" })
      );
    });

    // 10. Verify dashboard remains functional
    expect(screen.getByTestId("product-dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("cart-button")).toBeInTheDocument();
  });

  it("handles error states gracefully", async () => {
    // Mock service to throw error
    mockProductServiceInstance.getAllProducts.mockRejectedValue(
      new Error("Network error")
    );

    render(
      <IntegrationTestWrapper>
        <ProductDashboard />
      </IntegrationTestWrapper>
    );

    // Verify error state is displayed
    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByText("Error loading products")).toBeInTheDocument();
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });

    // Verify retry functionality
    const retryButton = screen.getByRole("button", { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it("maintains cart state across component interactions", async () => {
    render(
      <IntegrationTestWrapper>
        <ProductDashboard />
      </IntegrationTestWrapper>
    );

    // Wait for load and add items to cart
    await waitFor(() => {
      expect(screen.getByText("MacBook Pro")).toBeInTheDocument();
    });

    const addToCartButtons = screen.getAllByText("Add to Cart");

    // Add first product
    fireEvent.click(addToCartButtons[0]);

    // Add second product
    fireEvent.click(addToCartButtons[1]);

    // Verify cart count
    await waitFor(() => {
      const cartButton = screen.getByTestId("cart-button");
      const badge = cartButton.querySelector('[class*="badge"]');
      expect(badge).toHaveTextContent("2");
    });

    // Open cart and verify both items
    fireEvent.click(screen.getByTestId("cart-button"));

    await waitFor(() => {
      expect(screen.getByTestId("cart-item-1")).toBeInTheDocument();
      expect(screen.getByTestId("cart-item-2")).toBeInTheDocument();
      expect(screen.getByText("Total (2 items):")).toBeInTheDocument();
    });

    // Verify total calculation
    expect(screen.getByText("$2,299.98")).toBeInTheDocument();
  });

  it("handles responsive design and accessibility", async () => {
    render(
      <IntegrationTestWrapper>
        <ProductDashboard />
      </IntegrationTestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("MacBook Pro")).toBeInTheDocument();
    });

    // Verify responsive grid exists
    const productGrid = screen.getByTestId("product-grid");
    expect(productGrid).toBeInTheDocument();
    expect(productGrid).toHaveStyle({ display: "grid" });

    // Verify accessibility attributes
    const cartButton = screen.getByTestId("cart-button");
    expect(cartButton).toHaveAttribute("aria-label", "View cart");

    const searchInput = screen.getByPlaceholderText(/search products/i);
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("role", "searchbox");
  });
});
