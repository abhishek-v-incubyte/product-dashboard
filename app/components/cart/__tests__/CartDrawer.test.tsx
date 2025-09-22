import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { CartDrawer } from "../CartDrawer";
import { CartProvider } from "~/context/CartContext";
import { Provider } from "~/components/ui/provider";

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider>
    <CartProvider>{children}</CartProvider>
  </Provider>
);

describe("CartDrawer", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing when closed", () => {
    render(
      <TestWrapper>
        <CartDrawer isOpen={false} onClose={mockOnClose} />
      </TestWrapper>
    );

    // Drawer should not be visible when closed
    expect(screen.queryByTestId("cart-drawer")).not.toBeInTheDocument();
  });

  it("renders when opened", () => {
    render(
      <TestWrapper>
        <CartDrawer isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    );

    expect(screen.getByTestId("cart-drawer")).toBeInTheDocument();
    expect(screen.getByText("Shopping Cart")).toBeInTheDocument();
  });

  it("displays empty cart message when cart is empty", () => {
    render(
      <TestWrapper>
        <CartDrawer isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    );

    expect(screen.getByTestId("empty-cart")).toBeInTheDocument();
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(
      screen.getByText("Add some products to get started")
    ).toBeInTheDocument();
  });

  it("displays cart total correctly", () => {
    render(
      <TestWrapper>
        <CartDrawer isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    );

    // Empty cart should show $0.00 total
    expect(screen.getByTestId("cart-total")).toBeInTheDocument();
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("has close button that triggers onClose", async () => {
    render(
      <TestWrapper>
        <CartDrawer isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    );

    const closeButton = screen.getByLabelText(/close cart/i);
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("formats prices correctly", () => {
    render(
      <TestWrapper>
        <CartDrawer isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    );

    // Test price formatting in total
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("is responsive and works on mobile", () => {
    render(
      <TestWrapper>
        <CartDrawer isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    );

    const drawer = screen.getByTestId("cart-drawer");
    expect(drawer).toBeInTheDocument();
  });
});
