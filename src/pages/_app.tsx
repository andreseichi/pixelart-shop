import { useCart } from "@/stores/useCart";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

export const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

import { Dialog, DialogContent, DialogTrigger } from "@/components/Dialog";
import { ScrollArea } from "@/components/ScrollArea";
import axios from "axios";
import { useState } from "react";

import cartIcon from "@/assets/cart.svg";
import logoImg from "@/assets/logo.svg";
import trashIcon from "@/assets/trash.svg";

export default function App({ Component, pageProps }: AppProps) {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
    useState(false);

  const {
    productsAmount,
    cart,
    totalPriceCent,
    removeProduct,
    clearCart,
    updateProduct,
  } = useCart((state) => state);

  function handleRemoveProduct(productId: string) {
    removeProduct(productId);
  }

  async function handleBuyProduct() {
    try {
      const response = await axios.post("/api/checkout", {
        products: cart,
      });

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    } catch (error) {
      setIsCreatingCheckoutSession(false);
      alert("Falha ao redirecionar para o checkout");
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-start bg-gray-900 text-gray-100">
      <header className="mx-auto my-0 flex w-full max-w-[1180px] items-center justify-between px-0 py-8">
        <Link href="/" className="inline-block">
          <Image src={logoImg} alt="Logo Image" />
        </Link>
        <Dialog>
          <DialogTrigger>
            <div className="relative flex cursor-pointer items-center justify-center rounded-lg bg-zinc-700 p-3 hover:brightness-90">
              <Image
                src={cartIcon}
                height={24}
                width={24}
                className=""
                alt="Add to Cart"
              />

              {!!productsAmount && (
                <span className="absolute -right-4 -top-4 rounded-full bg-gray-900 p-1">
                  <span className="flex h-6 w-6 flex-1 items-center justify-center rounded-full bg-purple-600 p-2 text-sm font-bold text-gray-100">
                    {productsAmount}
                  </span>
                </span>
              )}
            </div>
          </DialogTrigger>

          <DialogContent>
            <div className="flex h-full flex-1 flex-col justify-between">
              <h2 className="text-xl font-bold text-zinc-200">Your Items</h2>

              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center justify-self-center">
                  <span className="text-lg font-semibold text-zinc-200">
                    Your cart is empty
                  </span>
                </div>
              ) : (
                <ScrollArea>
                  <div className="mt-8 flex flex-col gap-6">
                    {cart.map((product, index) => (
                      <div key={index} className="flex items-center gap-5">
                        <div className="flex h-[100px] w-[100px] items-center justify-center rounded-lg bg-[linear-gradient(180deg,_#1ea483_0%,_#7465d4_100%)]">
                          <Image
                            width={64}
                            height={64}
                            src={product.imageUrl}
                            alt={product.name}
                            className="object-cover"
                          />
                        </div>

                        <div className="flex h-full flex-col justify-between">
                          <div className="flex flex-col">
                            <span className="text-lg text-gray-400">
                              {product.name}
                            </span>
                            <span className="text-xl font-bold text-green-400">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(product.price)}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center gap-4">
                            <div className="flex items-center justify-center gap-3 rounded-full border-[1px] border-purple-600">
                              <button
                                onClick={() =>
                                  updateProduct(product.id, "decrement")
                                }
                                className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-center text-xl text-zinc-300 hover:brightness-90"
                              >
                                -
                              </button>

                              <span className="text-sm font-semibold text-zinc-200">
                                {product.amount}
                              </span>

                              <button
                                onClick={() =>
                                  updateProduct(product.id, "increment")
                                }
                                className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-center text-xl text-zinc-300 hover:brightness-90"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveProduct(product.id)}
                              className="ml-auto flex h-6 w-10 items-center justify-center rounded-lg bg-zinc-400 text-center text-xl hover:brightness-90"
                            >
                              <Image
                                src={trashIcon}
                                width={24}
                                height={24}
                                alt="Remove"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              <div className="flex flex-1 flex-col justify-end">
                <div className="flex justify-between text-zinc-200">
                  <span>Quantity</span>
                  <span className="text-lg">{productsAmount}</span>
                </div>

                <div className="flex justify-between font-bold text-zinc-200">
                  <span className="text-lg">Valor total</span>
                  <span className="text-2xl">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(totalPriceCent / 100)}
                  </span>
                </div>

                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="mt-1 cursor-pointer rounded-lg border-none bg-pink-800 p-1 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-60 [&:not(:disabled)]:hover:brightness-90"
                  >
                    Clear Cart
                  </button>
                )}

                <button
                  disabled={productsAmount === 0 || isCreatingCheckoutSession}
                  onClick={handleBuyProduct}
                  className="mt-2 cursor-pointer rounded-lg border-none bg-purple-600 p-3 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-60 [&:not(:disabled)]:hover:brightness-90"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <main className={`${roboto.variable} w-full flex-1 font-sans`}>
        <Component {...pageProps} />
      </main>
    </div>
  );
}
