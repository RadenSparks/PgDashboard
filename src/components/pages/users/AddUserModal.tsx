import React from "react";
import { Button } from "../../widgets/button";
import type { User } from "../users/usersData";

interface AddUserModalProps {
  show: boolean;
  newUser: User;
  onChange: (field: keyof User, value: string | boolean) => void;
  onSave: () => void;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  show,
  newUser,
  onChange,
  onSave,
  onClose,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4 sm:px-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl overflow-y-auto max-h-[90vh] relative border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold mb-6 text-blue-700">Add User</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave();
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
        {/* Left Column */}
        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={newUser.full_name}
            onChange={(e) => onChange("full_name", e.target.value)}
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={newUser.username}
            onChange={(e) => onChange("username", e.target.value)}
            required
          />
        </div>

        <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              type="password"
              value={newUser.password}
              onChange={e => onChange("password", e.target.value)}
              required
            />
          </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={newUser.phone_number ?? ""}
            onChange={e => onChange("phone_number", e.target.value)}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={newUser.address ?? ""}
            onChange={e => onChange("address", e.target.value)}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-1">Avatar URL</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={newUser.avatar_url ?? ""}
            onChange={e => onChange("avatar_url", e.target.value)}
            placeholder="https://..."
          />
        </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              type="email"
              value={newUser.email}
              onChange={e => onChange("email", e.target.value)}
              required
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">Role</label>
            <input
              className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
              value="user"
              disabled
              readOnly
            />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              value={newUser.status ? "Active" : "Suspended"}
              onChange={e => onChange("status", e.target.value === "Active")}
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end gap-2 pt-4">
            <Button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              type="submit"
            >
              Save
            </Button>
            <Button
              className="bg-gray-200 px-6 py-2 rounded-lg"
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;