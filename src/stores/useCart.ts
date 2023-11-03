import { Product } from "@/pages";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
  totalPriceCent: number;
  addProduct: (product: Product) => ProductCart[];
  removeProduct: (productId: string) => void;
  updateProduct: (productId: string, type: "increment" | "decrement") => void;
  clearCart: () => void;
}

export const useCart = create<useCartState>()(
  persist(
    (set, get) => ({
      cart: [],

      productsAmount: 0,

      totalPriceCent: 0,

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
            totalPriceCent:
              state.totalPriceCent + Math.round(product.price * 100),
          }));
        } else {
          set((state) => ({
            cart: [...state.cart, { ...product, amount: 1 }],
            productsAmount: state.productsAmount + 1,
            totalPriceCent:
              state.totalPriceCent + Math.round(product.price * 100),
          }));
        }

        return get().cart;
      },

      removeProduct: (productId: string) => {
        const foundProductInCart = get().cart.find(
          (productInCart) => productInCart.id === productId,
        ) as ProductCart;

        const amountToRemove = foundProductInCart?.amount || 1;

        const priceToRemove =
          Math.round(
            foundProductInCart?.price * foundProductInCart?.amount * 100,
          ) || 0;

        set((state) => ({
          cart: state.cart.filter(
            (productInCart) => productInCart.id !== productId,
          ),
          productsAmount: state.productsAmount - amountToRemove,
          totalPriceCent: state.totalPriceCent - priceToRemove,
        }));
      },

      updateProduct: (productId: string, type: "increment" | "decrement") => {
        const foundProductInCart = get().cart.find(
          (productInCart) => productInCart.id === productId,
        ) as ProductCart;

        if (!foundProductInCart) return;

        if (foundProductInCart.amount === 1 && type === "decrement") {
          return get().removeProduct(productId);
        }

        const updatedProduct = {
          ...foundProductInCart,
          amount:
            type === "increment"
              ? foundProductInCart.amount + 1
              : foundProductInCart.amount - 1,
        };

        set((state) => ({
          cart: state.cart.map((productInCart) =>
            productInCart.id === productId ? updatedProduct : productInCart,
          ),
          productsAmount:
            type === "increment"
              ? state.productsAmount + 1
              : state.productsAmount - 1,
          totalPriceCent:
            type === "increment"
              ? state.totalPriceCent +
                Math.round(foundProductInCart.price * 100)
              : state.totalPriceCent -
                Math.round(foundProductInCart.price * 100),
        }));
      },

      clearCart: () => {
        set(() => ({
          cart: [],
          productsAmount: 0,
          totalPriceCent: 0,
        }));
      },
    }),
    { name: "@pixelart-store:cart" },
  ),
);
