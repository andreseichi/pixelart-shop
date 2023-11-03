import { stripe } from "@/lib/stripe";
import { useCart } from "@/stores/useCart";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import Stripe from "stripe";

interface SuccessProps {
  customerName: string;
  products: {
    id: string;
    name: string;
    imageUrl: string;
    quantity: number;
  }[];
  productsAmount: number;
}

export default function Success({
  customerName,
  products,
  productsAmount,
}: SuccessProps) {
  const { clearCart } = useCart((state) => state);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <Head>
        <title>Compra efetuada | PixelArt Shop</title>

        <meta name="robots" content="noindex" />
      </Head>

      <main className="mx-auto my-0 flex h-[656px] flex-col items-center justify-center">
        <div className="flex items-center justify-center">
          {products.map((product, index) => (
            <div
              key={index}
              className="-mx-6 flex h-[145px] w-[145px] items-center justify-center rounded-full bg-[linear-gradient(180deg,_#1ea483_0%,_#7465d4_100%)] p-1 shadow-lg"
            >
              <Image
                className="h-full w-full rounded-full object-cover"
                src={product.imageUrl}
                width={520}
                height={480}
                alt={product.name}
              />
            </div>
          ))}
        </div>

        <h1 className="mt-16 text-3xl font-semibold text-gray-100">
          Order Confirmed!
        </h1>

        <p className="mt-8 max-w-[560px] text-center text-xl leading-9 text-gray-300">
          Hey <strong>{customerName}</strong>, your order of {productsAmount}{" "}
          products has been confirmed! <span>🎉🎉🎉</span>
        </p>

        <Link
          href="/"
          className="mt-20 block text-lg font-bold text-purple-600 hover:text-purple-500"
        >
          Back to catalog
        </Link>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.session_id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const sessionId = String(query.session_id);

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price.product"],
  });

  const customerName = session.customer_details?.name;
  const products = session.line_items?.data as Stripe.LineItem[];

  let quantity = 0;

  const productsFormated = products.flatMap((product) => {
    const PriceProduct = product?.price?.product as Stripe.Product;
    product.quantity = product.quantity as number;

    quantity += product.quantity;

    const productArray = [];

    for (let i = 0; i < product.quantity; i++) {
      productArray.push({
        id: PriceProduct.id,
        name: PriceProduct.name,
        imageUrl: PriceProduct.images[0],
      });
    }

    return productArray;
  });

  return {
    props: {
      customerName,
      products: productsFormated,
      productsAmount: quantity,
    },
  };
};
