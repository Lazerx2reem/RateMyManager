import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ref, get, update } from "firebase/database";
import { database } from "../../firebase";
import ManagerReview from "../../components/ManagerReview";
import ManagerNavbar from "../../components/ManagerNavbar";



export default function ManagerProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [manager, setManager] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(3);
  const [department, setDepartment] = useState("");
  const [overtime, setOvertime] = useState("");
  const [micromanages, setMicromanages] = useState("No");
  const [summary, setSummary] = useState("Loading summary...");

  useEffect(() => {
    if (!id) return;

    const fetchManager = async () => {
      try {
        const infoRef = ref(database, "info");
        const snapshot = await get(infoRef);

        if (snapshot.exists()) {
          const companies = snapshot.val();
          let foundManager = null;
          let allReviews = [];
          let totalRating = 0;
          let reviewCount = 0;

          for (const companyName in companies) {
            if (companies[companyName].managers && companies[companyName].managers[id]) {
              foundManager = {
                name: companies[companyName].managers[id].name,
                company: companyName,
                reviews: companies[companyName].managers[id].reviews || [],
              };

              allReviews = foundManager.reviews;
              allReviews.forEach((review) => {
                totalRating += review.rating || 0;
                reviewCount++;
              });

              break;
            }
          }

          if (foundManager) {
            setManager(foundManager);
            setReviews(allReviews);
            setRating(reviewCount > 0 ? totalRating / reviewCount : 0);

            fetchReviewSummary(allReviews);
          } else {
            setManager({ name: "Manager Not Found", company: "" });
          }
        } else {
          setManager({ name: "Manager Not Found", company: "" });
        }
      } catch (error) {
        console.error("Error fetching manager:", error);
      }
    };

    fetchManager();
  }, [id]);

  const handleAddReview = async () => {
    if (!newReview.trim()) {
      alert("Please enter a review before submitting.");
      return;
    }

    const review = {
      comment: newReview,
      rating: newRating ?? 3,
      department,
      overtime,
      micromanages,
      date: new Date().toISOString(),
    };

    const managerRef = ref(database, `info/${manager.company}/managers/${id}`);

    try {
      const snapshot = await get(managerRef);
      if (snapshot.exists()) {
        const managerData = snapshot.val();
        const existingReviews = Array.isArray(managerData.reviews) ? managerData.reviews : [];
        const updatedReviews = [...existingReviews, review];

        await update(managerRef, { reviews: updatedReviews });

        setReviews(updatedReviews);
        setNewReview("");
        setNewRating(3);
        setDepartment("");
        setOvertime("");
        setMicromanages("");

        fetchReviewSummary(updatedReviews);
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const fetchReviewSummary = async (reviews) => {
    if (reviews.length === 0) {
      console.log("No reviews available, skipping OpenAI request.");
      setSummary("No reviews available.");
      return;
    }
  
    console.log("Fetching review summary from OpenAI...", reviews);
  
    try {
      const response = await fetch("/api/reviewSummary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews }),
      });
  
      console.log("API Response:", response);
  
      const data = await response.json();
      console.log("Summary Response Data:", data);
  
      setSummary(data.summary || "No summary available.");
    } catch (error) {
      console.error("Error fetching review summary:", error);
      setSummary("Error loading summary.");
    }
  };
  
  



  if (!manager) return <div>Loading...</div>;

  return (
    <div>
      <ManagerNavbar />
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
        <h1 className="text-3xl font-bold text-gray-800">{manager.name}</h1>
        <h3 className="text-lg text-gray-500 mt-2">Company: {manager.company}</h3>
        <h4 className="text-lg text-gray-600 mt-1">
          Average Rating: {rating ? rating.toFixed(2) : "No ratings yet"} / 5
        </h4>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 w-96 mt-6">
        <h2 className="text-xl font-semibold">Add a Review</h2>
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full p-3 mt-2 border rounded-lg"
        />
        <textarea
          className="w-full p-3 mt-2 border rounded-lg"
          placeholder="Write your review here..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        />
        <div className="flex justify-between mt-2">
          <label className="font-semibold">Rating (1-5):</label>
          <input
            type="number"
            min="1"
            max="5"
            value={newRating || 3}
            onChange={(e) => setNewRating(Number(e.target.value) || 3)}
            className="w-16 p-2 border rounded-lg"
          />
        </div>
        <div className="flex justify-between mt-2">
          <label className="font-semibold">Overtime Required:</label>
          <select
            className="p-2 border rounded-lg"
            value={overtime}
            onChange={(e) => setOvertime(e.target.value)}
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>
        <div className="flex justify-between mt-2">
          <label className="font-semibold">Micromanages:</label>
          <select
            className="p-2 border rounded-lg"
            value={micromanages}
            onChange={(e) => setMicromanages(e.target.value)}
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>
        <button
          onClick={handleAddReview}
          className="mt-3 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition duration-300 w-full"
        >
          Submit Review
        </button>
        <p className="text-md font-semibold text-gray-700 mt-4">Review Summary:</p>
          <p className="text-gray-600 italic">{summary}</p>
      </div>

      <div className="w-96 mt-6">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review, index) => <ManagerReview key={index} review={review} />)
        ) : (
          <p className="text-gray-600 mt-2">Be the first to review!</p>
        )}
      </div>
    </div>
  </div>
  );
}