import { stripe } from "@/lib/stripe";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Stripe from "stripe";

interface SuccessProps {
  customerName: string;
  product: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

export default function Success({ customerName, product }: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra efetuada | PixelArt Shop</title>

        <meta name="robots" content="noindex" />
      </Head>

      <main className="mx-auto my-0 flex h-[656px] flex-col items-center justify-center">
        <h1 className="text-2xl text-gray-100">Compra efetuada!</h1>

        <div className="mt-16 flex h-[145px] w-full max-w-[130px] items-center justify-center rounded-lg bg-[linear-gradient(180deg,_#1ea483_0%,_#7465d4_100%)] p-1">
          <Image
            className="object-cover"
            src={product.imageUrl}
            width={520}
            height={480}
            alt={product.name}
          />
        </div>

        <p className="mt-8 max-w-[560px] text-center text-xl leading-9 text-gray-300">
          Obaaa <strong>{customerName}</strong>, sua compra de{" "}
          <strong>{product.name}</strong> foi efetuada com sucesso!
        </p>

        <Link
          href="/"
          className="mt-20 block text-lg font-bold text-green-600 hover:text-green-500"
        >
          Voltar ao catálogo
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
    expand: ["line_items", "line_items.data.price.product"],
  });

  const customerName = session.customer_details?.name;
  const product = session.line_items?.data[0].price?.product as Stripe.Product;

  return {
    props: {
      customerName,
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
      },
    },
  };
};
