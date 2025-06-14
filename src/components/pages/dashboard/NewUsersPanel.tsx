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
  <div className="bg-white rounded-xl shadow p-6 flex flex-col h-full">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <FaUserPlus className="text-pink-500" size={22} />
        Newly Joined Users
      </h3>
      <Button
        className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded text-sm hover:bg-blue-200 transition"
        onClick={handleNavigateToNewUsers}
      >
        View All
        <FaArrowRight />
      </Button>
    </div>
    <ul className="flex flex-col gap-4">
      {newUsers.map((user, idx) => (
        <li
          key={idx}
          className="flex items-center gap-4 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="rounded-full object-cover border-2 border-pink-400"
            width={48}
            height={48}
            style={{ width: 48, height: 48 }}
          />
          <div className="flex flex-col flex-1">
            <span className="font-semibold text-gray-800">{user.name}</span>
            <span className="text-gray-500 text-sm">{user.email}</span>
            <span className="text-xs text-gray-400">
              Joined {new Date(user.joined).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default NewUsersPanel;