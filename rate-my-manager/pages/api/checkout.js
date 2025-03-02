import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { id } = req.body; // Ensure ID is passed correctly

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: "prod_RrRP3dB5Rd9ihF", // ✅ Replace with YOUR real Stripe Price ID
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription-success?id=${id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/manager-subscription?id=${id}`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("🚨 Stripe Checkout Error:", error);
    res.status(500).json({ error: "Failed to create checkout session." });
  }
}
