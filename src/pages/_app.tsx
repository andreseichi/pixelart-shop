import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import Image from "next/image";

export const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

import logoImg from "@/assets/logo.svg";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-start bg-gray-900 text-gray-100">
      <header className="mx-auto my-0 w-full max-w-[1180px] px-0 py-8">
        <Image src={logoImg} alt="Logo Image" />
      </header>

      <main className={`${roboto.variable} w-full font-sans`}>
        <Component {...pageProps} />
      </main>
    </div>
  );
}
