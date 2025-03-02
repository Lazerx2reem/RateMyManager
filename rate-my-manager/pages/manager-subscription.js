import { useRouter } from "next/router";

export default function ManagerSubscription() {
  const router = useRouter();
  const { id } = router.query;

  const handleSubscribe = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        alert("Failed to create checkout session.");
      }
    } catch (error) {
      console.error("Error processing subscription:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Want to Improve?</h1>
        <p className="text-gray-600 mb-4">
          See data insights and analysis on your reviews.
        </p>
        <button
          onClick={handleSubscribe}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Subscribe for $1.99/month
        </button>
      </div>
    </div>
  );
}
