// pages/Managers/manager-preview.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ref, get } from 'firebase/database';
import { database } from '../../firebase';  // Adjust this import path as needed
import StripeCheckoutButton from '../../components/StripeCheckoutButton'; // Add this if it's in components folder

const ManagerPreview = () => {
  const router = useRouter();
  const { id } = router.query;  // We will use dynamic routing by the manager's ID
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchManagerReviews = async () => {
      try {
        const infoRef = ref(database, 'info');
        const snapshot = await get(infoRef);

        if (snapshot.exists()) {
          const companies = snapshot.val();
          let foundReviews = [];

          for (const companyName in companies) {
            if (companies[companyName].managers && companies[companyName].managers[id]) {
              foundReviews = companies[companyName].managers[id].reviews || [];
              break;
            }
          }

          setReviews(foundReviews.slice(0, 3)); // Get first 3 reviews
          setAllReviews(foundReviews);  // Store all reviews for later
        }
      } catch (error) {
        console.error('Error fetching manager reviews:', error);
      }
    };

    fetchManagerReviews();
  }, [id]);

  const handlePaymentSuccess = () => {
    setShowPayment(true); // Show the content after the manager pays
  };

  return (
    <div className="container mx-auto pt-10">
      <h1 className="text-3xl font-bold text-center">Manager Preview</h1>
      <h2 className="text-lg text-center my-4">See the first 3 reviews</h2>
      
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="mb-4">
              <p><strong>Rating: {review.rating} / 5</strong></p>
              <p>{review.comment}</p>
              <hr className="my-2" />
            </div>
          ))
        ) : (
          <p>No reviews available yet.</p>
        )}

        {/* Show all reviews after payment */}
        {showPayment && allReviews.length > 3 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">All Reviews</h3>
            {allReviews.map((review, index) => (
              <div key={index} className="mb-4">
                <p><strong>Rating: {review.rating} / 5</strong></p>
                <p>{review.comment}</p>
                <hr className="my-2" />
              </div>
            ))}
          </div>
        )}

        {/* Payment section */}
        {!showPayment && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Unlock Full Access to Reviews</h3>
            <p>Pay to unlock all reviews and get a comprehensive overview.</p>
            <StripeCheckoutButton onSuccess={handlePaymentSuccess} />
          </div>
        )}

        {showPayment && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Thank you for your payment!</h3>
            <p>You've unlocked full access to all reviews.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerPreview;
