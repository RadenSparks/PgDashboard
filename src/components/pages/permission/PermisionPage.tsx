import { useState } from "react";
import { Button } from "../../widgets/button";
import { FaEdit, FaUserShield, FaUserEdit, FaUser } from "react-icons/fa";

type Role = {
	id: number;
	name: string;
	permissions: {
		edit: boolean;
		delete: boolean;
		update: boolean;
	};
};

type User = {
	id: number;
	name: string;
	role: "Admin" | "Editor" | "Viewer";
	email: string;
};

const mockRoles: Role[] = [
	{
		id: 1,
		name: "Admin",
		permissions: { edit: true, delete: true, update: true },
	},
	{
		id: 2,
		name: "Editor",
		permissions: { edit: true, delete: false, update: true },
	},
	{
		id: 3,
		name: "Viewer",
		permissions: { edit: false, delete: false, update: false },
	},
];

const mockUsers: User[] = [
	{ id: 1, name: "Alice Johnson", role: "Admin", email: "alice@email.com" },
	{ id: 2, name: "Bob Smith", role: "Editor", email: "bob@email.com" },
	{ id: 3, name: "Charlie Lee", role: "Viewer", email: "charlie@email.com" },
	{ id: 4, name: "Diana Prince", role: "Admin", email: "diana@email.com" },
	{ id: 5, name: "Eve Adams", role: "Editor", email: "eve@email.com" },
];

const PermissionPage = () => {
	const [roles, setRoles] = useState<Role[]>(mockRoles);
	const [editRoleId, setEditRoleId] = useState<number | null>(null);
	const [editPermissions, setEditPermissions] = useState<Role["permissions"]>({
		edit: false,
		delete: false,
		update: false,
	});

	const handleEdit = (role: Role) => {
		setEditRoleId(role.id);
		setEditPermissions(role.permissions);
	};

	const handleSave = () => {
		setRoles((prev) =>
			prev.map((role) =>
				role.id === editRoleId
					? { ...role, permissions: { ...editPermissions } }
					: role
			)
		);
		setEditRoleId(null);
	};

	const handlePermissionChange = (
		perm: keyof Role["permissions"],
		value: boolean
	) => {
		setEditPermissions((prev) => ({ ...prev, [perm]: value }));
	};

	const groupedUsers = {
		Admin: mockUsers.filter((u) => u.role === "Admin"),
		Editor: mockUsers.filter((u) => u.role === "Editor"),
		Viewer: mockUsers.filter((u) => u.role === "Viewer"),
	};

	return (
		<div className="p-8">
			<h2 className="text-2xl font-bold mb-6">
				Role & Permission Configuration
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
				{/* Admins */}
				<div className="bg-white rounded-xl shadow p-4">
					<div className="flex items-center gap-2 mb-2">
						<FaUserShield className="text-blue-600" />
						<span className="font-semibold text-lg">Admins</span>
					</div>
					<ul>
						{groupedUsers.Admin.length === 0 && (
							<li className="text-gray-400 text-sm">No admins found.</li>
						)}
						{groupedUsers.Admin.map((user) => (
							<li key={user.id} className="mb-1">
								<span className="font-medium">{user.name}</span>
								<span className="text-gray-500 text-xs ml-2">
									{user.email}
								</span>
							</li>
						))}
					</ul>
				</div>
				{/* Editors */}
				<div className="bg-white rounded-xl shadow p-4">
					<div className="flex items-center gap-2 mb-2">
						<FaUserEdit className="text-green-600" />
						<span className="font-semibold text-lg">Editors</span>
					</div>
					<ul>
						{groupedUsers.Editor.length === 0 && (
							<li className="text-gray-400 text-sm">No editors found.</li>
						)}
						{groupedUsers.Editor.map((user) => (
							<li key={user.id} className="mb-1">
								<span className="font-medium">{user.name}</span>
								<span className="text-gray-500 text-xs ml-2">
									{user.email}
								</span>
							</li>
						))}
					</ul>
				</div>
				{/* Viewers */}
				<div className="bg-white rounded-xl shadow p-4">
					<div className="flex items-center gap-2 mb-2">
						<FaUser className="text-gray-600" />
						<span className="font-semibold text-lg">Viewers</span>
					</div>
					<ul>
						{groupedUsers.Viewer.length === 0 && (
							<li className="text-gray-400 text-sm">No viewers found.</li>
						)}
						{groupedUsers.Viewer.map((user) => (
							<li key={user.id} className="mb-1">
								<span className="font-medium">{user.name}</span>
								<span className="text-gray-500 text-xs ml-2">
									{user.email}
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className="bg-white rounded-xl shadow p-6">
				<div className="overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead>
							<tr className="text-left border-b">
								<th className="py-2 px-2">Role</th>
								<th className="py-2 px-2">Edit</th>
								<th className="py-2 px-2">Delete</th>
								<th className="py-2 px-2">Update</th>
								<th className="py-2 px-2">Actions</th>
							</tr>
						</thead>
						<tbody>
							{roles.map((role) => (
								<tr key={role.id} className="border-b hover:bg-gray-50">
									<td className="py-2 px-2 font-semibold">{role.name}</td>
									<td className="py-2 px-2">
										{editRoleId === role.id ? (
											<input
												type="checkbox"
												checked={editPermissions.edit}
												onChange={(e) =>
													handlePermissionChange(
														"edit",
														e.target.checked
													)
												}
											/>
										) : (
											<span>{role.permissions.edit ? "✅" : "❌"}</span>
										)}
									</td>
									<td className="py-2 px-2">
										{editRoleId === role.id ? (
											<input
												type="checkbox"
												checked={editPermissions.delete}
												onChange={(e) =>
													handlePermissionChange(
														"delete",
														e.target.checked
													)
												}
											/>
										) : (
											<span>{role.permissions.delete ? "✅" : "❌"}</span>
										)}
									</td>
									<td className="py-2 px-2">
										{editRoleId === role.id ? (
											<input
												type="checkbox"
												checked={editPermissions.update}
												onChange={(e) =>
													handlePermissionChange(
														"update",
														e.target.checked
													)
												}
											/>
										) : (
											<span>{role.permissions.update ? "✅" : "❌"}</span>
										)}
									</td>
									<td className="py-2 px-2 flex gap-2">
										{editRoleId === role.id ? (
											<>
												<Button
													size="sm"
													className="bg-green-600 text-white px-3 py-1 rounded"
													onClick={handleSave}
												>
													Save
												</Button>
												<Button
													size="sm"
													className="bg-gray-200 px-3 py-1 rounded"
													onClick={() => setEditRoleId(null)}
												>
													Cancel
												</Button>
											</>
										) : (
											<Button
												size="sm"
												className="bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200"
												onClick={() => handleEdit(role)}
											>
												<FaEdit className="inline mr-1" />
												Edit
											</Button>
										)}
									</td>
								</tr>
							))}
							{roles.length === 0 && (
								<tr>
									<td colSpan={5} className="py-6 text-center text-gray-400">
										No roles found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
			<div className="mt-6 text-gray-500 text-sm">
				<strong>Note:</strong> These permissions affect what actions each role can
				performance on the admin account and throughout the dashboard.
			</div>
		</div>
	);
};

export default PermissionPage;