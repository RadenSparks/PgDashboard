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
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[180px] w-full">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-center">
          <MdComment className="text-blue-500" size={22} />
          Recent Product Comment
        </h3>
        <span className="text-gray-400 text-sm text-center">No recent comments available.</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[200px] w-full">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-center">
        <MdComment className="text-blue-500" size={22} />
        Recent Product Comment
      </h3>
      <div
        className={`flex flex-col items-center transition-opacity duration-300 ease-in-out max-w-sm text-center ${
          fade ? "opacity-100" : "opacity-0"
        }`}
        key={currentComment}
      >
        <span className="font-semibold text-gray-800 truncate">{recentComments[currentComment].user}</span>
        <span className="text-gray-600 text-sm mb-1">
          on <span className="font-medium">{recentComments[currentComment].product}</span>
        </span>
        <p className="text-gray-700 text-sm mb-2 max-w-xs">{recentComments[currentComment].comment}</p>
        <span className="text-xs text-gray-400">{recentComments[currentComment].date}</span>

        <div className="w-full flex justify-center mt-3 px-2">
          <Button
            className="px-4 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded text-sm hover:bg-blue-200 transition max-w-full text-center whitespace-normal break-words"
            onClick={() => handleNavigateToComment(recentComments[currentComment].user)}
          >
            View Comments by {recentComments[currentComment].user.split(" ")[0]}
          </Button>
        </div>


        <div className="flex gap-1 mt-3 justify-center">
          {recentComments.map((_, idx) => (
            <span
              key={idx}
              className={`inline-block w-2 h-2 rounded-full ${
                idx === currentComment ? "bg-blue-500" : "bg-gray-300"
              }`}
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    <RecentCommentsPanel
      recentComments={earliestReviews}
      currentComment={currentComment}
      fade={fade}
      handleNavigateToComment={handleNavigateToComment}
    />
    // ...other components...
    </div>
  );
};

export default RecentCommentsPanel;