import { Button } from "../../widgets/button";
import { MdComment } from "react-icons/md";

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

export default RecentCommentsPanel;