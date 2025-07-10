import { Button } from "../../widgets/button";
import { MdComment } from "react-icons/md";
import { useGetProductReviewsQuery } from "../../../redux/api/reviewsApi";

type Comment = {
  user: string;
  comment: string;
  product: string;
  date: string;
};

type RecentCommentsPanelProps = {
  recentComments: Comment[];
  currentComment: number;
  fade: boolean;
  handleNavigateToComment: (user: string) => void;
};

const RecentCommentsPanel = ({
  recentComments,
  currentComment,
  fade,
  handleNavigateToComment,
}: RecentCommentsPanelProps) => {
  if (!recentComments.length || !recentComments[currentComment]) {
    return (
      <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center min-h-[180px]">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <MdComment className="text-blue-500" size={22} />
          Recent Product Comment
        </h3>
        <span className="text-gray-400">No recent comments available.</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center min-h-[180px]">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <MdComment className="text-blue-500" size={22} />
        Recent Product Comment
      </h3>
      <div
        className={`flex flex-col items-center transition-opacity duration-300 ease-in-out ${
          fade ? "opacity-100" : "opacity-0"
        }`}
        key={currentComment}
      >
        <span className="font-semibold text-gray-800">{recentComments[currentComment].user}</span>
        <span className="text-gray-600 text-sm mb-1">
          on <span className="font-medium">{recentComments[currentComment].product}</span>
        </span>
        <span className="text-gray-700 text-center px-2">{recentComments[currentComment].comment}</span>
        <span className="text-xs text-gray-400 mt-1">{recentComments[currentComment].date}</span>
        <Button
          className="mt-3 px-4 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded text-sm hover:bg-blue-200 transition"
          onClick={() => handleNavigateToComment(recentComments[currentComment].user)}
        >
          View All Comments by {recentComments[currentComment].user}
        </Button>
        <div className="flex gap-1 mt-3">
          {recentComments.map((_, idx) => (
            <span
              key={idx}
              className={`inline-block w-2 h-2 rounded-full ${idx === currentComment ? "bg-blue-500" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const DashboardContent = () => {
  // Fetch all reviews (replace 0 with a valid productId or use a getAllReviews endpoint if available)
  const { data: allReviews = [] } = useGetProductReviewsQuery(0); // Adjust this line if you have a getAllReviews endpoint

  // Sort reviews by createdAt ascending (earliest first)
  const earliestReviews = [...allReviews]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(0, 4) // Show the first 4 earliest reviews
    .map(r => ({
      user: r.user?.username || "Unknown User",
      comment: r.content,
      product: r.productName || "Product",
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "",
    }));

  // ...other logic...

  return (
    <RecentCommentsPanel
      recentComments={earliestReviews}
      currentComment={currentComment}
      fade={fade}
      handleNavigateToComment={handleNavigateToComment}
    />
    // ...other components...
  );
};

export default RecentCommentsPanel;