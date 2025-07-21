import React from "react";
import { Button } from "../../widgets/button";
import { FaUserPlus, FaFilter } from "react-icons/fa";
import type { User } from "../users/usersData";

interface RecentlyJoinedUsersProps {
  recentUsers: User[];
  onShowOnlyNew: () => void;
}

const RecentlyJoinedUsers: React.FC<RecentlyJoinedUsersProps> = ({
  recentUsers,
  onShowOnlyNew,
}) => (
  <div className="bg-white rounded-xl shadow p-6 mb-8">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <FaUserPlus className="text-pink-500" size={22} />
        <span className="font-semibold text-lg">Recently Joined Users</span>
      </div>
      <Button
        className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded text-sm hover:bg-blue-200 transition"
        onClick={onShowOnlyNew}
      >
        <FaFilter />
        Show Only New Users
      </Button>
    </div>
    <ul className="flex flex-wrap gap-8">
      {recentUsers.map((user) => (
        <li
          key={user.id}
          className="flex flex-col items-center bg-gray-50 rounded-lg p-4 w-60 shadow hover:bg-gray-100 transition"
        >
          <img
            src={user.avatar_url || "/assets/image/profile5.jpg"}
            alt={user.full_name}
            className="rounded-full object-cover border-2 border-pink-400 mb-2"
            width={56}
            height={56}
            style={{ width: 56, height: 56 }}
          />
          <span className="font-semibold text-gray-800">{user.full_name}</span>
          <span className="text-gray-500 text-sm line-clamp-2">{user.email}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentlyJoinedUsers;