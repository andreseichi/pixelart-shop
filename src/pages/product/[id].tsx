import { ProductSkeleton } from "@/components/Skeleton/ProductSkeleton";
import { stripe } from "@/lib/stripe";
import { useCart } from "@/stores/useCart";
import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Stripe from "stripe";
import { shallow } from "zustand/shallow";

type Product = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  description: string;
  defaultPriceId: string;
};
interface ProductProps {
  product: Product;
}

export default function Product({ product }: ProductProps) {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
    useState(false);

  const { addProduct, cart } = useCart(({ addProduct, cart }) => ({
    addProduct,
    cart,
  }));

  const { isFallback } = useRouter();

  function handleAddCart() {
    const productFormated = {
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      defaultPriceId: product.defaultPriceId,
    };

    addProduct(productFormated);
  }

  async function handleBuyProduct() {
    try {
      const productFormated = {
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        defaultPriceId: product.defaultPriceId,
      };

      const cartUpdated = addProduct(productFormated);

      const response = await axios.post("/api/checkout", {
        products: cartUpdated,
      });

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    } catch (error) {
      setIsCreatingCheckoutSession(false);
      alert("Falha ao redirecionar para o checkout");
    }
  }

  if (isFallback) {
    return (
      <main className="m-auto grid max-w-[1180px] grid-cols-2 items-stretch gap-16">
        <ProductSkeleton />
      </main>
    );
  }

  const title = `${product.name} | PixelArt Shop`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <main className="m-auto grid max-w-[1180px] grid-cols-2 items-stretch gap-16">
        <div className="flex h-[656px] w-full max-w-[576px] items-center justify-center rounded-lg bg-[linear-gradient(180deg,_#1ea483_0%,_#7465d4_100%)] object-cover p-1">
          <Image
            className="object-cover"
            src={product.imageUrl}
            width={520}
            height={480}
            alt={product.name}
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-gray-300">
            {product.name}
          </h1>

          <span className="mt-4 block text-2xl text-green-400">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(product.price)}
          </span>

          <p className="mt-10 leading-7 text-gray-300">{product.description}</p>

          <div className="mt-auto flex flex-col gap-4">
            <button
              disabled={isCreatingCheckoutSession}
              onClick={handleAddCart}
              className="[&:not(:disabled)hover:brightness-90] cursor-pointer rounded-lg border-none bg-fuchsia-600 p-4 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Add to Cart
            </button>

            <button
              disabled={isCreatingCheckoutSession}
              onClick={handleBuyProduct}
              className="[&:not(:disabled)hover:brightness-90] cursor-pointer rounded-lg border-none bg-purple-600 p-4 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Buy Now
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params,
}) => {
  const productId = params?.id;

  const product = await stripe.products.retrieve(productId as string, {
    expand: ["default_price"],
  });

  const price = product.default_price as Stripe.Price;

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: price.unit_amount ? price.unit_amount / 100 : 0,
        description: product.description,
        defaultPriceId: price.id,
      },
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: { id: "prod_OvaD9whPGu84NJ" },
      },
    ],
    fallback: true,
  };
};
