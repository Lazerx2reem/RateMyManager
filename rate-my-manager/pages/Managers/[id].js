import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ManagerNavbar from "../../components/ManagerNavbar";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

export default function ManagerProfile() {
  const router = useRouter();
  const { id } = router.query;  // Retrieve the manager's ID or name from the URL
  const [manager, setManager] = useState(null);
  const [newReview, setNewReview] = useState("");

  useEffect(() => {
    if (id) {
      const fetchManager = async () => {
        const managerRef = doc(db, "managers", id);
        const managerSnap = await getDoc(managerRef);

        if (managerSnap.exists()) {
          setManager({ id, ...managerSnap.data() });
        } else {
          setManager({ name: "Unknown", reviews: [] });
        }
      };

      fetchManager();
    }
  }, [id]);

  const handleAddReview = async () => {
    if (!newReview.trim()) return;

    const managerRef = doc(db, "managers", id);
    const review = {
      comment: newReview,
      date: new Date().toISOString(),
    };

    await updateDoc(managerRef, {
      reviews: arrayUnion(review),
    });

    setManager((prev) => ({
      ...prev,
      reviews: [...prev.reviews, review],
    }));
    setNewReview("");
  };

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
          <h3 className="mt-6 text-xl">Reviews:</h3>
      {manager.reviews.length > 0 ? (
        manager.reviews.map((review, index) => (
          <div key={index} className="border p-2 my-2 rounded">
            <p>{review.comment}</p>
            <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
      </div>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Write a review..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          className="border p-2 rounded w-full"
        />
      <div className="write-review">
      <button
        onClick={handleWriteReviewClick}
        className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 mt-4"
      >
        Write a Review
      </button>
      </div>
      </div>
      </div>
  );
}
