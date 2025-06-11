import { useState } from "react";
import { StarIcon } from "../components/Icons.jsx";

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([
    {
      id: 1,
      customer: "John Doe",
      orderId: 1001,
      rating: 4,
      comment: "The burger was delicious but the fries were a bit cold.",
      date: "2023-05-14",
    },
    {
      id: 2,
      customer: "Jane Smith",
      orderId: 1002,
      rating: 5,
      comment: "Excellent pizza! Will definitely order again.",
      date: "2023-05-13",
    },
    {
      id: 3,
      customer: "Mike Johnson",
      orderId: 1003,
      rating: 3,
      comment: "Sandwich was okay, but the bread was a bit dry.",
      date: "2023-05-12",
    },
    {
      id: 4,
      customer: "Sarah Williams",
      orderId: 1004,
      rating: 2,
      comment: "Pasta was overcooked and salad was not fresh.",
      date: "2023-05-11",
    },
    {
      id: 5,
      customer: "David Brown",
      orderId: 1005,
      rating: 5,
      comment: "Best Caesar salad I've had in a long time!",
      date: "2023-05-10",
    },
  ]);

  const [filterRating, setFilterRating] = useState("all");

  const filteredFeedback = filterRating === "all"
    ? feedbackList
    : feedbackList.filter((fb) => fb.rating === parseInt(filterRating));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Customer Feedback
        </h1>
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredFeedback.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  {feedback.customer}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Order #{feedback.orderId} • {feedback.date}
                </p>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${
                      i < feedback.rating
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              {feedback.comment}
            </p>
          </div>
        ))}
      </div>

      {filteredFeedback.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            No feedback matches your selected filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default Feedback;