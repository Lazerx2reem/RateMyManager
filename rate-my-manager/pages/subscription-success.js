import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SubscriptionSuccess() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      localStorage.setItem(`subscribed_${id}`, "true");
    }
  }, [id]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Subscription Successful!</h1>
        <p className="text-gray-600 mb-4">Thank you for subscribing. You now have access to detailed insights.</p>

        <button
          onClick={() => router.push(`/data-analysis?id=${id}`)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Go to Data Analysis
        </button>
      </div>
    </div>
  );
}
