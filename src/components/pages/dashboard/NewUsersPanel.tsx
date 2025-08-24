import { Button } from "../../widgets/button";
import { FaUserPlus, FaArrowRight } from "react-icons/fa";

type NewUser = {
  name: string;
  avatar: string;
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
        <span>Người dùng mới đăng ký</span>
      </h3>
      <div className="self-end sm:self-auto">
        <Button
          className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded text-sm hover:bg-blue-200 transition"
          onClick={handleNavigateToNewUsers}
        >
          Xem tất cả
          <FaArrowRight />
        </Button>
      </div>
    </div>

    <ul className="flex flex-col gap-4">
      {newUsers.length === 0 ? (
        <li className="text-gray-400 text-center py-6">Chưa có người dùng mới.</li>
      ) : (
        newUsers.map((user, idx) => (
          <li
            key={user.email || idx}
            className="flex sm:items-center gap-3 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="rounded-full object-cover border-2 border-pink-400 w-12 h-12"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(user.name || "Người dùng");
              }}
            />

            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-semibold text-gray-800 truncate">
                {user.name}
              </span>
              <span className="text-gray-500 text-sm break-words whitespace-normal">
                {user.email}
              </span>
            </div>
          </li>
        ))
      )}
    </ul>
  </div>
);

export default NewUsersPanel;
