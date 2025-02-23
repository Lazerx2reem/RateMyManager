import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function WriteReview() {
  const router = useRouter();
  const { manager } = router.query;  // Retrieve the manager name from the query parameter

  const [quality, setQuality] = useState(3);
  const [difficulty, setDifficulty] = useState(3);
  const [teamName, setTeamName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString());

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle form submission, e.g., sending data to the server
    alert(`Review for ${manager} submitted!\nQuality: ${quality}\nDifficulty: ${difficulty}\nTeam Name: ${teamName}\nReview: ${reviewText}\nDate: ${date}`);
  };

  // Ensure manager name is available before rendering the form
  if (!manager) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Write a Review for {manager}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Quality</label>
          <input
            type="number"
            min="1"
            max="5"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
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
            onChange={(e) => setDifficulty(e.target.value)}
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

        <div>
          <label className="block font-semibold">Date</label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300"
            disabled
          />
        </div>

        <button
          type="submit"
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
