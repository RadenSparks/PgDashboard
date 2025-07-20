import { Button } from "../../widgets/button";
import { FaUserPlus, FaArrowRight } from "react-icons/fa";

type NewUser = {
  name: string;
  avatar: string;
  joined: string;
  email: string;
};

type NewUsersPanelProps = {
  newUsers: NewUser[];
  handleNavigateToNewUsers: () => void;
};

const NewUsersPanel = ({
  newUsers,
  handleNavigateToNewUsers,
}: NewUsersPanelProps) => (
  <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col h-full">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <FaUserPlus className="text-pink-500" size={22} />
        <span>Newly Joined Users</span>
      </h3>
      <div className="self-end sm:self-auto">
        <Button
          className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded text-sm hover:bg-blue-200 transition"
          onClick={handleNavigateToNewUsers}
        >
          View All
          <FaArrowRight />
        </Button>
      </div>
    </div>

    <ul className="flex flex-col gap-4">
      {newUsers.map((user, idx) => (
      <li
        key={idx}
        className="flex sm:items-center gap-3 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="rounded-full object-cover border-2 border-pink-400 w-12 h-12"
        />

        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-semibold text-gray-800 truncate">{user.name}</span>
          <span className="text-gray-500 text-sm break-words whitespace-normal">{user.email}</span>
          <span className="text-xs text-gray-400 break-words whitespace-normal">
            Joined{" "}
            {user.joined
              ? new Date(user.joined).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </span>
        </div>
      </li>

      ))}
    </ul>
  </div>
);

export default NewUsersPanel;
