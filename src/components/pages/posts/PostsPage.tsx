import { useState } from "react";
import { Button } from "../../widgets/button";
import { IoMdAdd } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import { useGetPostsQuery, useDeletePostMutation } from '../../../redux/postsApi';
import PostForm from "./PostForm";
import CatalogueManager from './CatalogueManager';

const PostsPage = () => {
  const { data: posts = [], refetch } = useGetPostsQuery();
  const [deletePost] = useDeletePostMutation();
  const [previewPost, setPreviewPost] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState<any | null>(null);
  const [showCatalogueManager, setShowCatalogueManager] = useState(false);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-800">Posts</h2>
        <div className="flex gap-2">
          <Button
            className="flex gap-2 px-4 py-2 bg-gray-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition font-semibold"
            onClick={() => setShowCatalogueManager(true)}
          >
            <span>Manage Catalogues</span>
          </Button>
          <Button
            className="flex gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow"
            onClick={() => { setEditPost(null); setShowForm(true); }}
          >
            <IoMdAdd size={22} />
            <span>Add Post</span>
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="overflow-x-auto">
          <table className="min-w-full text-base">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3 px-3 font-semibold text-gray-700">Title</th>
                <th className="py-3 px-3 font-semibold text-gray-700">Canonical</th>
                <th className="py-3 px-3 font-semibold text-gray-700">Catalogue</th>
                <th className="py-3 px-3 font-semibold text-gray-700">Created</th>
                <th className="py-3 px-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b hover:bg-blue-50 transition">
                  <td className="py-2 px-3">{post.name}</td>
                  <td className="py-2 px-3 text-blue-700">{post.canonical}</td>
                  <td className="py-2 px-3">{post.catalogue?.name || '-'}</td>
                  <td className="py-2 px-3">{post.created_at?.slice(0, 10)}</td>
                  <td className="py-2 px-3 flex gap-2">
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
                      onClick={() => { setEditPost(post); setShowForm(true); }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 px-3 py-1 rounded"
                      onClick={async () => {
                        await deletePost(post.id);
                        refetch();
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 text-lg">
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Catalogue Manager Modal */}
      {showCatalogueManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setShowCatalogueManager(false)}
              aria-label="Close catalogue manager"
            >
              &times;
            </button>
            <CatalogueManager />
          </div>
        </div>
      )}

      {/* Post Markdown Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-0 relative overflow-hidden">
            <button
              className="absolute top-4 right-6 text-gray-400 hover:text-gray-700 text-3xl"
              onClick={() => setPreviewPost(null)}
              aria-label="Close preview"
            >
              &times;
            </button>
            {/* Main site-like layout */}
            <div className="w-full">
              {/* Banner image if available */}
              {previewPost.image && (
                <div className="h-56 w-full bg-gray-200 flex items-center justify-center overflow-hidden rounded-t-2xl">
                  <img
                    src={previewPost.image}
                    alt={previewPost.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="p-8">
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full mr-2">
                    {previewPost.catalogue?.name || 'Uncategorized'}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {previewPost.created_at?.slice(0, 10)}
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold mb-2 text-gray-900">{previewPost.name}</h1>
                <div className="mb-4 text-gray-500 italic">{previewPost.description}</div>
                <div className="prose prose-blue max-w-none text-gray-800 mb-6">
                  <ReactMarkdown>{previewPost.content}</ReactMarkdown>
                </div>
                <div className="border-t pt-4 text-xs text-gray-400 space-y-1">
                  {previewPost.meta_title && <div><b>Meta Title:</b> {previewPost.meta_title}</div>}
                  {previewPost.meta_description && <div><b>Meta Desc:</b> {previewPost.meta_description}</div>}
                  {previewPost.meta_keyword && <div><b>Meta Keyword:</b> {previewPost.meta_keyword}</div>}
                  <div><b>Canonical:</b> {previewPost.canonical}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Post Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-8 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setShowForm(false)}
              aria-label="Close form"
            >
              &times;
            </button>
            <PostForm
              initialData={editPost || {}}
              onSuccess={() => {
                setShowForm(false);
                refetch();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsPage;