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
  const [micromanages, setMicromanages] = useState("");

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
      rating: newRating,
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
        const updatedReviews = managerData.reviews ? [...managerData.reviews, review] : [review];

        await update(managerRef, { reviews: updatedReviews });

        setReviews(updatedReviews);
        setNewReview("");
        setNewRating();
        setDepartment("");
        setOvertime("");
        setMicromanages("");
      }
    } catch (error) {
      console.error("Error adding review:", error);
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
            value={newRating}
            onChange={(e) => setNewRating(parseInt(e.target.value))}
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