import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { useKeenSlider } from "keen-slider/react";

import { stripe } from "@/lib/stripe";
import "keen-slider/keen-slider.min.css";
import Stripe from "stripe";

import cartIcon from "@/assets/cart.svg";
import { useCart } from "@/stores/useCart";
import { Arrow } from "@/components/Arrow";
import { useState } from "react";

export type Product = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  defaultPriceId: string;
};

interface HomeProps {
  products: Product[];
}

export default function Home({ products }: HomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedSlide, setLoadedSlide] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slides: {
      perView: 3,
      spacing: 48,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoadedSlide(true);
    },
  });

  const { addProduct } = useCart((state) => state);

  function handleAddCart(product: any) {
    addProduct(product);
  }

  return (
    <>
      <Head>
        <title>Home | PixelArt Shop</title>
      </Head>

      <div
        ref={sliderRef}
        className="keen-slider relative ml-auto flex min-h-[656px] w-full max-w-[calc(100vw-((100vw-1180px)/2))]"
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

              <footer className="absolute bottom-1 left-1 right-1 flex translate-y-[110%] items-center justify-between rounded-md bg-black/60 px-3 py-4 opacity-0 transition-all ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
                <div className="flex flex-col">
                  <strong className="text-lg">{product.name}</strong>
                  <span className="text-xl font-bold text-green-400">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(product.price)}
                  </span>
                </div>

                <div
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddCart(product);
                  }}
                  className="rounded-lg bg-purple-600 p-2 hover:brightness-90"
                >
                  <Image
                    src={cartIcon}
                    width={32}
                    height={32}
                    alt="Add to Cart"
                  />
                </div>
              </footer>
            </div>
          </Link>
        ))}

        {loadedSlide && instanceRef.current && (
          <>
            <Arrow
              left
              onClick={(e: any) =>
                e.stopPropagation() || instanceRef.current?.prev()
              }
              disabled={currentSlide === 0}
            />

            <Arrow
              onClick={(e: any) =>
                e.stopPropagation() || instanceRef.current?.next()
              }
              disabled={
                currentSlide ===
                instanceRef.current.track.details.slides.length - 1
              }
            />
          </>
        )}
      </div>
      {loadedSlide && instanceRef.current && (
        <div className="mt-4 flex justify-center gap-1 px-[10px] py-0">
          {[
            ...Array(
              instanceRef.current.track.details.slides.length - 2,
            ).keys(),
          ].map((idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx);
                }}
                className={
                  "mx-0 my-[5px] h-[10px] w-[10px] cursor-pointer rounded-full border-none bg-zinc-50 p-[5px]" +
                  (currentSlide === idx ? " bg-black" : "")
                }
              ></button>
            );
          })}
        </div>
      )}
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
      price: price.unit_amount ? price.unit_amount / 100 : 0,
      defaultPriceId: price.id,
    };
  });

  return {
    props: { products },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
