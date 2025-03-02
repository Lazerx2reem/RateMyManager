import { useRouter } from "next/router";

export default function DataAnalysis() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Data Analysis</h1>
        <p className="text-gray-600 mb-4">Here are insights based on your manager reviews.</p>

        {/* Future: Display charts, trends, etc. */}
        <div className="bg-gray-200 p-4 rounded-lg">📊 Data Analysis Coming Soon...</div>

        <button
          onClick={() => router.push(`/managers/${id}`)}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
}
