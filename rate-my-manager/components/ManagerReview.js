import { Card } from "../components/ui/card";

const getRatingColor = (rating) => {
  if (rating >= 4) return "bg-green-200";
  if (rating >= 3) return "bg-yellow-200";
  if (rating >= 2) return "bg-orange-200";
  return "bg-red-200";
};

const ManagerReview = ({ review }) => {
  return (
    <Card className="p-4 mb-4 border rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Anonymous User</h3>
        <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
      </div>
      
      <div className="flex items-center mt-2">
        <div className={`w-12 h-12 flex items-center justify-center text-lg font-bold rounded-md ${getRatingColor(review.rating)}`}>
          {review.rating}
        </div>
        <div className="ml-4">
          <p className="text-md font-semibold">{review.department || "N/A"}</p>
          <p className="text-gray-600">Overtime: <span className="font-semibold">{review.overtime ? "Yes" : "No"}</span></p>
          <p className="text-gray-600">Micromanages: <span className="font-semibold">{review.micromanages ? "Yes" : "No"}</span></p>
          <p className="text-gray-600">Work-Life Balance: <span className="font-semibold">{review.workLifeBalance}</span></p>
        </div>
      </div>
      
      <p className="mt-4 text-gray-700">{review.comment}</p>
    </Card>
  );
};

export default ManagerReview;