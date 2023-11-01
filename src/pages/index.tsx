import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

import { useKeenSlider } from "keen-slider/react";

import { stripe } from "@/lib/stripe";
import "keen-slider/keen-slider.min.css";
import Stripe from "stripe";

interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
  }[];
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });

  return (
    <>
      <Head>
        <title>Home | PixelArt Shop</title>
      </Head>

      <div
        ref={sliderRef}
        className="keen-slider ml-auto flex min-h-[656px] w-full max-w-[calc(100vw-((100vw-1180px)/2))]"
      >
        {products.map((product) => (
          <Link
            key={product.id}
            href={`product/${product.id}`}
            prefetch={false}
          >
            <div className="keen-slider__slide group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[linear-gradient(180deg,_#1ea483_0%,_#7465d4_100%)]">
              <Image
                className="object-cover"
                src={product.imageUrl}
                width={520}
                height={480}
                alt="dog product"
              />

              <footer className="absolute bottom-1 left-1 right-1 flex translate-y-[110%] items-center justify-between rounded-md bg-black/60 p-8 opacity-0 transition-all ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
                <strong className="text-lg">{product.name}</strong>
                <span className="text-xl font-bold text-green-400">
                  {product.price}
                </span>
              </footer>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ["data.default_price"],
  });

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price;

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price.unit_amount ? price.unit_amount / 100 : 0),
    };
  });

  return {
    props: { products },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
