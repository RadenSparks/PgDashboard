import { useState } from "react";
import { Button } from "../../widgets/button";
import { IoMdAdd } from "react-icons/io";
import ReactMarkdown from "react-markdown";

const mockPosts = [
	{
		id: 1,
		title: "Welcome to Our Store!",
		author: "Admin",
		date: "2025-06-01",
		status: "Published",
		content: "We're excited to welcome you to our new online store! Browse our latest products and enjoy exclusive deals.",
	},
	{
		id: 2,
		title: "Summer Sale Announced",
		author: "Jane Doe",
		date: "2025-05-28",
		status: "Draft",
		content: "Get ready for our biggest summer sale yet! Discounts on all board games and accessories. Stay tuned for more details.",
	},
	{
		id: 3,
		title: "How to Choose the Best Board Game",
		author: "John Smith",
		date: "2025-05-20",
		status: "Published",
		content: "Choosing the right board game can be tough. Here are our top tips for finding the perfect game for your group.",
	},
];

const PostsPage = () => {
		const [posts] = useState(mockPosts);
		const [previewPost, setPreviewPost] = useState<typeof mockPosts[0] | null>(null);

		return (
				<div className="p-8">
						<div className="flex justify-between items-center mb-6">
								<h2 className="text-2xl font-bold">Posts</h2>
								<Button className="flex gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
										<IoMdAdd size={20} />
										<span>Add Post</span>
								</Button>
						</div>
						<div className="bg-white rounded-xl shadow p-6">
								<div className="overflow-x-auto">
										<table className="min-w-full text-sm">
												<thead>
														<tr className="text-left border-b">
																<th className="py-2 px-2">Title</th>
																<th className="py-2 px-2">Author</th>
																<th className="py-2 px-2">Date</th>
																<th className="py-2 px-2">Status</th>
																<th className="py-2 px-2">Actions</th>
														</tr>
												</thead>
												<tbody>
														{posts.map((post) => (
																<tr key={post.id} className="border-b hover:bg-gray-50">
																		<td className="py-2 px-2">{post.title}</td>
																		<td className="py-2 px-2">{post.author}</td>
																		<td className="py-2 px-2">{post.date}</td>
																		<td className="py-2 px-2">
																				<span
																						className={
																								post.status === "Published"
																										? "text-green-600 font-semibold"
																										: "text-yellow-600 font-semibold"
																						}
																				>
																						{post.status}
																				</span>
																		</td>
																		<td className="py-2 px-2 flex gap-2">
																				<Button
																						size="sm"
																						className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 px-3 py-1 rounded"
																						onClick={() => setPreviewPost(post)}
																				>
																						Preview
																				</Button>
																				<Button
																						size="sm"
																						className="bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200 px-3 py-1 rounded"
																				>
																						Edit
																				</Button>
																				<Button
																						size="sm"
																						className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 px-3 py-1 rounded"
																				>
																						Delete
																				</Button>
																		</td>
																</tr>
														))}
														{posts.length === 0 && (
																<tr>
																		<td colSpan={5} className="py-6 text-center text-gray-400">
																				No posts found.
																		</td>
																</tr>
														)}
												</tbody>
										</table>
								</div>
						</div>

						{/* Post Markdown Preview Modal */}
						{previewPost && (
								<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
										<div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
												<button
														className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
														onClick={() => setPreviewPost(null)}
														aria-label="Close preview"
												>
														&times;
												</button>
												<div className="mb-6 border-b pb-3">
														<h3 className="text-2xl font-bold mb-1">{previewPost.title}</h3>
														<div className="mb-1 text-sm text-gray-500">
																By <span className="font-semibold">{previewPost.author}</span> &middot;{" "}
																{previewPost.date}
														</div>
														<span
																className={
																		previewPost.status === "Published"
																				? "inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
																				: "inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"
																}
														>
																{previewPost.status}
														</span>
												</div>
												<div
														className="prose prose-blue max-w-none text-gray-800 overflow-y-auto"
														style={{ maxHeight: "60vh" }}
												>
														<ReactMarkdown>{previewPost.content}</ReactMarkdown>
												</div>
										</div>
								</div>
						)}
				</div>
		);
};

export default PostsPage;