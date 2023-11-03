import { stripe } from "@/lib/stripe";
import { ProductCart } from "@/stores/useCart";
import { NextApiRequest, NextApiResponse } from "next";

interface RequestBody {
  products: ProductCart[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // how do I type products?
  const { products }: RequestBody = req.body;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (products.length === 0) {
    return res.status(400).json({ error: "Price not found." });
  }

  const successUrl = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = process.env.NEXT_URL;

  const items = products.map((product) => ({
    price: product.defaultPriceId,
    quantity: product.amount,
  }));

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: items,
    cancel_url: cancelUrl,
    success_url: successUrl,
  });

  return res.status(201).json({
    checkoutUrl: checkoutSession.url,
  });
}
