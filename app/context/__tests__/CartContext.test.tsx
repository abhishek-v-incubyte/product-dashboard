import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import { CartProvider, useCart } from "../CartContext";
import type { Product } from "~/types/product";

const mockProduct: Product = {
  id: "1",
  name: "Test Product",
  description: "Test description",
  price: 99.99,
  category: "Electronics",
  image: "test.jpg",
  rating: 4.5,
  reviewCount: 100,
  inStock: true,
  tags: ["test"],
};

const mockProduct2: Product = {
  id: "2",
  name: "Second Product",
  description: "Second test description",
  price: 49.99,
  category: "Books",
  image: "test2.jpg",
  rating: 4.0,
  reviewCount: 50,
  inStock: true,
  tags: ["test2"],
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe("CartContext", () => {
  it("should provide initial empty cart state", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cart.items).toEqual([]);
    expect(result.current.cart.totalItems).toBe(0);
    expect(result.current.cart.totalPrice).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should add item to cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
    });

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0]).toEqual({
      productId: "1",
      quantity: 2,
      product: mockProduct,
    });
    expect(result.current.cart.totalItems).toBe(2);
    expect(result.current.cart.totalPrice).toBe(199.98);
  });

  it("should add multiple different items to cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
      result.current.addToCart(mockProduct2, 3);
    });

    expect(result.current.cart.items).toHaveLength(2);
    expect(result.current.cart.totalItems).toBe(4);
    expect(result.current.cart.totalPrice).toBe(249.96);
  });

  it("should increase quantity when adding existing item", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
      result.current.addToCart(mockProduct, 2);
    });

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].quantity).toBe(3);
    expect(result.current.cart.totalItems).toBe(3);
    expect(result.current.cart.totalPrice).toBe(299.97);
  });

  it("should remove item from cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
      result.current.addToCart(mockProduct2, 1);
    });

    expect(result.current.cart.items).toHaveLength(2);

    act(() => {
      result.current.removeFromCart("1");
    });

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].productId).toBe("2");
    expect(result.current.cart.totalItems).toBe(1);
    expect(result.current.cart.totalPrice).toBe(49.99);
  });

  it("should update item quantity", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
    });

    act(() => {
      result.current.updateQuantity("1", 5);
    });

    expect(result.current.cart.items[0].quantity).toBe(5);
    expect(result.current.cart.totalItems).toBe(5);
    expect(result.current.cart.totalPrice).toBe(499.95);
  });

  it("should remove item when quantity is set to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
      result.current.addToCart(mockProduct2, 1);
    });

    expect(result.current.cart.items).toHaveLength(2);

    act(() => {
      result.current.updateQuantity("1", 0);
    });

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].productId).toBe("2");
  });

  it("should not update quantity for non-existent item", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });

    const initialState = result.current.cart;

    act(() => {
      result.current.updateQuantity("nonexistent", 5);
    });

    expect(result.current.cart).toEqual(initialState);
  });

  it("should clear cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
      result.current.addToCart(mockProduct2, 1);
    });

    expect(result.current.cart.items).toHaveLength(2);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cart.items).toEqual([]);
    expect(result.current.cart.totalItems).toBe(0);
    expect(result.current.cart.totalPrice).toBe(0);
  });

  it("should calculate total price correctly with different quantities", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2); // $99.99 * 2 = $199.98
      result.current.addToCart(mockProduct2, 3); // $49.99 * 3 = $149.97
    });

    expect(result.current.cart.totalPrice).toBe(349.95);
  });

  it("should handle edge case with 0 quantity in addToCart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 0);
    });

    expect(result.current.cart.items).toEqual([]);
    expect(result.current.cart.totalItems).toBe(0);
    expect(result.current.cart.totalPrice).toBe(0);
  });

  it("should handle negative quantity gracefully", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
    });

    act(() => {
      result.current.updateQuantity("1", -1);
    });

    // Should remove the item or set to 0
    expect(result.current.cart.items).toEqual([]);
  });

  it("should provide getItemQuantity helper", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.getItemQuantity("1")).toBe(0);

    act(() => {
      result.current.addToCart(mockProduct, 3);
    });

    expect(result.current.getItemQuantity("1")).toBe(3);
  });

  it("should provide isInCart helper", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.isInCart("1")).toBe(false);

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });

    expect(result.current.isInCart("1")).toBe(true);
    expect(result.current.isInCart("2")).toBe(false);
  });

  it("should handle concurrent operations correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      // Simulate rapid consecutive operations
      result.current.addToCart(mockProduct, 1);
      result.current.addToCart(mockProduct, 1);
      result.current.updateQuantity("1", 5);
      result.current.addToCart(mockProduct2, 2);
      result.current.removeFromCart("1");
    });

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].productId).toBe("2");
    expect(result.current.cart.totalItems).toBe(2);
  });
});
