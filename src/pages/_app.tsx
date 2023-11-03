import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/stores/useCart";

export const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

import cartIcon from "@/assets/cart.svg";
import logoImg from "@/assets/logo.svg";

export default function App({ Component, pageProps }: AppProps) {
  const { productsAmount } = useCart((state) => state);

  return (
    <div className="flex min-h-screen w-full flex-col items-start bg-gray-900 text-gray-100">
      <header className="mx-auto my-0 flex w-full max-w-[1180px] items-center justify-between px-0 py-8">
        <Link href="/" className="inline-block">
          <Image src={logoImg} alt="Logo Image" />
        </Link>

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
      </header>

      <main className={`${roboto.variable} w-full flex-1 font-sans`}>
        <Component {...pageProps} />
      </main>
    </div>
  );
}
