import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductCard } from "../ProductCard";
import type { Product } from "~/types/product";
import { Provider } from "~/components/ui/provider";

const mockProduct: Product = {
  id: "1",
  name: "Test Product",
  description: "This is a test product description that should be displayed",
  price: 99.99,
  category: "Electronics",
  image: "https://example.com/test-image.jpg",
  rating: 4.5,
  reviewCount: 123,
  inStock: true,
  tags: ["test", "product"],
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(<Provider>{component}</Provider>);
};

describe("ProductCard", () => {
  const mockOnAddToCart = vi.fn();

  beforeEach(() => {
    mockOnAddToCart.mockClear();
  });

  it("should render product information correctly", () => {
    renderWithProvider(
      <ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />
    );

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This is a test product description that should be displayed"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("(123 reviews)")).toBeInTheDocument();
  });

  it("should display product image with correct src and alt text", () => {
    renderWithProvider(
      <ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />
    );

    const image = screen.getByRole("img", { name: /test product/i });
    expect(image).toHaveAttribute("src", mockProduct.image);
    expect(image).toHaveAttribute("alt", mockProduct.name);
  });

  it("should show in stock status when product is available", () => {
    renderWithProvider(
      <ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />
    );

    expect(screen.getByText("In Stock")).toBeInTheDocument();
    expect(screen.queryByText("Out of Stock")).not.toBeInTheDocument();
  });

  it("should show out of stock status when product is unavailable", () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };

    renderWithProvider(
      <ProductCard product={outOfStockProduct} onAddToCart={mockOnAddToCart} />
    );

    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
    expect(screen.queryByText("In Stock")).not.toBeInTheDocument();
  });

  it("should call onAddToCart when add to cart button is clicked", async () => {
    renderWithProvider(
      <ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />
    );

    const addButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct, 1);
    });
  });

  it("should disable add to cart button when product is out of stock", () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };

    renderWithProvider(
      <ProductCard product={outOfStockProduct} onAddToCart={mockOnAddToCart} />
    );

    const addButton = screen.getByRole("button", { name: /add to cart/i });
    expect(addButton).toBeDisabled();
  });

  it("should display rating correctly", () => {
    renderWithProvider(
      <ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />
    );

    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("should handle missing image gracefully", () => {
    const productWithoutImage = { ...mockProduct, image: "" };

    renderWithProvider(
      <ProductCard
        product={productWithoutImage}
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("should have hover effects", () => {
    renderWithProvider(
      <ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />
    );

    const card = screen.getByTestId("product-card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveStyle("cursor: pointer");
  });

  it("should display product tags", () => {
    renderWithProvider(
      <ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />
    );

    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("product")).toBeInTheDocument();
  });

  it("should handle zero reviews gracefully", () => {
    const productWithNoReviews = { ...mockProduct, reviewCount: 0 };

    renderWithProvider(
      <ProductCard
        product={productWithNoReviews}
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(screen.getByText("(0 reviews)")).toBeInTheDocument();
  });

  it("should format price correctly", () => {
    const productWithDifferentPrice = { ...mockProduct, price: 1234.56 };

    renderWithProvider(
      <ProductCard
        product={productWithDifferentPrice}
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(screen.getByText("$1234.56")).toBeInTheDocument();
  });
});
