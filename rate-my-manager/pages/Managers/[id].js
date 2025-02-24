import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ManagerNavbar from "../../components/ManagerNavbar";
import Link from "next/link";
import { sample } from "../Managers/sample"

export default function ManagerProfile() {
  const router = useRouter();
  const { id } = router.query;  // Retrieve the manager's ID or name from the URL
  const [manager, setManager] = useState(null);

  useEffect(() => {
    if (id) {
      const foundManager = sample.find((m) => m.id === id);
      setManager(foundManager || { name: "Unknown", company: "N/A", reviews: [] });
    }
  }, [id]);

  // If id is not available yet, show a loading message
  if (!manager) {
    return <div>Loading...</div>;
  }

  const handleWriteReviewClick = () => {
    router.push({
      pathname: "/Managers/WriteReview",
      query: { manager: manager },  // Passing the manager to the WriteReview page
    });
  };

  // Sample data (replace with dynamic data from API or database)
  const ratings = { 5: 10, 4: 20, 3: 15, 2: 5, 1: 2 }; // Number of people who rated each score

  // Calculate the average rating
  const totalRatings = Object.keys(ratings).reduce((acc, rating) => acc + ratings[rating] * rating, 0);
  const totalPeople = Object.values(ratings).reduce((acc, num) => acc + num, 0);
  const averageRating = totalPeople > 0 ? (totalRatings / totalPeople).toFixed(2) : 0;

  // Get the max number of ratings to normalize the bars
  const maxRatings = Math.max(...Object.values(ratings));

  // Redirect to the review page
  const handleWriteReview = () => {
    router.push(`/write-review?manager=${name}`);
  };

  return (
    <div>
      <ManagerNavbar />
      <div className="ManagerProfile">
        <h1>Manager Profile: {name}</h1>
        <h2>Average Rating</h2>
          <span className="AverageRatingValue">{averageRating}</span>
          <span className="average-rating-text ml-2 text-lg">/ 5</span>
          {manager.reviews.length > 0 ? (
  <ul className="mt-4 space-y-4">
    {manager.reviews.map((review) => (
      <li key={review.id} className="border p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <span className="font-bold">Anonymous</span>
          <span>{review.rating} / 5</span>
        </div>
        <p className="text-gray-500 text-sm">{review.date}</p>
        <p className="mt-2">{review.comment}</p>
      </li>
    ))}
  </ul>
) : (
  <p>No reviews available.</p>
)}
      </div>

      <div className="write-review">
      <button
        onClick={handleWriteReviewClick}
        className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 mt-4"
      >
        Write a Review
      </button>
      </div>
      </div>
  );
}
