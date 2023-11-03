import { Product } from "@/pages";
import { create } from "zustand";

export type ProductCart = {
  id: string;
  price: number;
  name: string;
  imageUrl: string;
  defaultPriceId: string;
  amount: number;
};

interface useCartState {
  cart: ProductCart[];
  productsAmount: number;
  addProduct: (product: Product) => ProductCart[];
  removeProduct: (productId: string) => void;
}

export const useCart = create<useCartState>((set, get) => ({
  cart: [],

  productsAmount: 0,

  addProduct: (product: Product) => {
    const foundProductInCart = get().cart.find(
      (productInCart) =>
        product.defaultPriceId === productInCart.defaultPriceId,
    );

    if (foundProductInCart) {
      const updatedProduct = {
        ...foundProductInCart,
        amount: foundProductInCart.amount + 1,
      };

      set((state) => ({
        cart: state.cart.map((productInCart) =>
          product.defaultPriceId === productInCart.defaultPriceId
            ? updatedProduct
            : productInCart,
        ),
        productsAmount: state.productsAmount + 1,
      }));
    } else {
      set((state) => ({
        cart: [...state.cart, { ...product, amount: 1 }],
        productsAmount: state.productsAmount + 1,
      }));
    }

    return get().cart;
  },

  removeProduct: (productId: string) => {
    set((state) => ({
      cart: state.cart.filter(
        (productInCart) => productInCart.id !== productId,
      ),
      productsAmount: state.productsAmount - 1,
    }));
  },
}));
