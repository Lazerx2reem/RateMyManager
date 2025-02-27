import { useState } from "react";
import { useRouter } from "next/router";
import { ref, get, update } from "firebase/database";
import { database } from "../firebase";

export default function WriteReview() {
  const router = useRouter();
  const { id, name, company } = router.query;

  const [quality, setQuality] = useState(3);
  const [difficulty, setDifficulty] = useState(3);
  const [teamName, setTeamName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [date, setDate] = useState(new Date().toISOString());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      alert("Please enter a review.");
      return;
    }
  
    const review = {
      comment: reviewText,
      quality,
      difficulty,
      team: teamName,
      rating: (quality + difficulty) / 2, // Average rating
      date,
    };
  
    const managerRef = ref(database, `info/${company}/managers/${id}`);
  
    try {
      const snapshot = await get(managerRef);
      if (snapshot.exists()) {
        const managerData = snapshot.val();
        const updatedReviews = managerData.reviews ? [...managerData.reviews, review] : [review];
  
        await update(managerRef, { reviews: updatedReviews });
  
        alert("Review submitted!");
        router.push(`/managers/${id}`); // ✅ Redirects correctly
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  

  if (!id) return <div>Loading...</div>;

  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Write a Review for {name}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Quality</label>
            <input
              type="number"
              min="1"
              max="5"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full p-3 rounded-lg border border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Difficulty</label>
            <input
              type="number"
              min="1"
              max="5"
              value={difficulty}
              onChange={(e) => setDifficulty(parseInt(e.target.value))}
              className="w-full p-3 rounded-lg border border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300"
              required
            />
          </div>

          <button type="submit" className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
