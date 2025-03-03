import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '../firebase'; // Adjust the path if needed
import { doc, getDoc } from 'firebase/firestore';

export default function DataAnalysis() {
  const router = useRouter();
  const { id } = router.query;
  const [managerData, setManagerData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchManagerData = async () => {
      try {
        const managerRef = doc(db, 'managers', id); // Adjust collection name
        const managerSnap = await getDoc(managerRef);

        if (managerSnap.exists()) {
          const data = managerSnap.data();
          setManagerData(data);
          setReviews(data.reviews || []); // Assuming `reviews` is an array in your Firestore
        } else {
          console.error('No such manager found!');
        }
      } catch (error) {
        console.error('Error fetching manager data:', error);
      }
    };

    fetchManagerData();
  }, [id]);

  const generateSummary = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/analyze-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviews }),
      });

      const result = await response.json();

      if (response.ok) {
        setSummary(result.summary);
      } else {
        setSummary('Failed to generate summary');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('Error generating summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Data Analysis</h1>
        <p className="text-gray-600 mb-4">Here are insights based on your manager reviews.</p>

        {managerData ? (
          <div className="bg-gray-200 p-4 rounded-lg text-left">
            <h2 className="text-lg font-semibold">Manager Insights</h2>
            <p><strong>Average Rating:</strong> {managerData.averageRating}/5</p>
            <p><strong>Most Common Tags:</strong> {managerData.tags?.join(", ")}</p>
            <button
              onClick={generateSummary}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              disabled={loading}
            >
              {loading ? 'Generating Summary...' : 'Generate Review Summary'}
            </button>
          </div>
        ) : (
          <p>Loading manager data...</p>
        )}

        {summary && (
          <div className="bg-green-100 p-4 rounded-lg mt-4 text-left">
            <h2 className="text-lg font-semibold">Review Summary</h2>
            <p>{summary}</p>
          </div>
        )}

        <button
          onClick={() => router.push(`/Managers/${id}`)}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
}
