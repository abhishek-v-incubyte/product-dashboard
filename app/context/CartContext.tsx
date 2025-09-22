import React, { createContext, useContext, useReducer, useMemo } from "react";
import type { Product, Cart, CartItem, CartAction } from "~/types/product";

interface CartState {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
}

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  cart: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  },
  isLoading: false,
  error: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity = 1 } = action.payload;

      // Don't add if quantity is 0 or negative
      if (quantity <= 0) {
        return state;
      }

      const existingItemIndex = state.cart.items.findIndex(
        (item) => item.productId === product.id
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.cart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          productId: product.id,
          quantity,
          product,
        };
        newItems = [...state.cart.items, newItem];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      return {
        ...state,
        cart: {
          items: newItems,
          totalItems,
          totalPrice: Math.round(totalPrice * 100) / 100, // Round to 2 decimal places
        },
      };
    }

    case "REMOVE_ITEM": {
      const { productId } = action.payload;
      const newItems = state.cart.items.filter(
        (item) => item.productId !== productId
      );

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      return {
        ...state,
        cart: {
          items: newItems,
          totalItems,
          totalPrice: Math.round(totalPrice * 100) / 100,
        },
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;

      // Remove item if quantity is 0 or negative
      if (quantity <= 0) {
        return cartReducer(state, {
          type: "REMOVE_ITEM",
          payload: { productId },
        });
      }

      const itemExists = state.cart.items.some(
        (item) => item.productId === productId
      );
      if (!itemExists) {
        return state; // Item doesn't exist, no change
      }

      const newItems = state.cart.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      return {
        ...state,
        cart: {
          items: newItems,
          totalItems,
          totalPrice: Math.round(totalPrice * 100) / 100,
        },
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const contextValue = useMemo<CartContextType>(
    () => ({
      ...state,
      addToCart: (product: Product, quantity: number = 1) => {
        dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
      },
      removeFromCart: (productId: string) => {
        dispatch({ type: "REMOVE_ITEM", payload: { productId } });
      },
      updateQuantity: (productId: string, quantity: number) => {
        dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
      },
      clearCart: () => {
        dispatch({ type: "CLEAR_CART" });
      },
      getItemQuantity: (productId: string) => {
        const item = state.cart.items.find(
          (item) => item.productId === productId
        );
        return item?.quantity || 0;
      },
      isInCart: (productId: string) => {
        return state.cart.items.some((item) => item.productId === productId);
      },
    }),
    [state]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
