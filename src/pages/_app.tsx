import { roboto } from "@/fonts";
import "@/styles/globals.css";
import { useCart } from "@/stores/useCart";
import type { AppProps } from "next/app";
import Image from "next/image";
import Link from "next/link";

import { Dialog, DialogContent, DialogTrigger } from "@/components/Dialog";
import { CartMenu } from "@/components/CartMenu";

import cartIcon from "@/assets/cart.svg";
import logoImg from "@/assets/logo.svg";
import HydrationZustand from "@/components/HydrationZustand";

export default function App({ Component, pageProps }: AppProps) {
  const { productsAmount } = useCart((state) => state);

  return (
    <HydrationZustand>
      <div
        className={`flex min-h-screen w-full flex-col items-start bg-gray-900 text-gray-100 ${roboto.variable}`}
      >
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
              <CartMenu />
            </DialogContent>
          </Dialog>
        </header>

        <main className={`w-full flex-1 font-sans ${roboto.variable}`}>
          <Component {...pageProps} />
        </main>
      </div>
    </HydrationZustand>
  );
}
