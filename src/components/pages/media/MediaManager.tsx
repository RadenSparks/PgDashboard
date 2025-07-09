import React, { useState, useRef, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import { useGetMediaQuery, useAddMediaMutation, useDeleteMediaMutation, useUpdateMediaMutation, useDeleteFolderMutation } from "../../../redux/api/mediaApi";
import type { MediaItem } from "../../../redux/api/mediaApi";
import FolderTree from "./FolderTree";
import Breadcrumbs from "./Breadcrumbs";
import MediaGrid from "./MediaGrid";
import MoveModal from "./MoveModal";
import DeleteFolderModal from "./DeleteFolderModal";
import DeleteMediaModal from "./DeleteMediaModal"; 

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "diishpkrl";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your_unsigned_preset";

// Helper to build a folder tree from flat media list
function buildFolderTree(media: MediaItem[]) {
  const root: any = {};
  media.forEach((item) => {
    const parts = (item.folder || "default").split("/").filter(Boolean);
    let node = root;
    for (const part of parts) {
      node.children = node.children || {};
      node.children[part] = node.children[part] || {};
      node = node.children[part];
    }
    node.items = node.items || [];
    node.items.push(item);
  });
  return root;
}

// Helper: get all folder paths as array of strings (e.g. ["folder1", "folder1/subfolder", ...])
function getAllFolderPaths(tree: any, prefix: string[] = []): string[] {
  let paths: string[] = [];
  if (prefix.length) paths.push(prefix.join("/"));
  if (tree.children) {
    Object.keys(tree.children).forEach((folder) => {
      paths = paths.concat(getAllFolderPaths(tree.children[folder], [...prefix, folder]));
    });
  }
  return paths;
}

const MediaManager: React.FC = () => {
  // --- State ---
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [] = useState(0);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [moveTargetFolder, setMoveTargetFolder] = useState<string | null>(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  const [showDeleteMediaModal, setShowDeleteMediaModal] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [folderPath, setFolderPath] = useState<string[]>([]);
  const [virtualFolders, setVirtualFolders] = useState<string[][]>([]);
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Data ---
  const { data: media = [], refetch, isLoading } = useGetMediaQuery();
  const [addMedia] = useAddMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();
  const [updateMedia] = useUpdateMediaMutation(); // Add this to your imports from mediaApi
  const [deleteFolder] = useDeleteFolderMutation();

  // --- Folder tree logic ---
  const folderTree = useMemo(() => {
    const tree = buildFolderTree(media);
    // Add virtual folders
    virtualFolders.forEach(pathArr => {
      let node = tree;
      for (const part of pathArr) {
        node.children = node.children || {};
        node.children[part] = node.children[part] || {};
        node = node.children[part];
      }
    });
    return tree;
  }, [media, virtualFolders]);

  // --- Current node ---
  const getCurrentNode = (tree: any, path: string[]) => {
    let node = tree;
    for (const part of path) {
      if (!node.children || !node.children[part]) return { items: [] };
      node = node.children[part];
    }
    return node;
  };
  const currentNode = getCurrentNode(folderTree, folderPath);
  const currentMedia: MediaItem[] = currentNode.items || [];

  // --- Helper to extract Cloudinary public_id from URL ---
  const getCloudinaryPublicId = (url: string) => {
    try {
      const parts = url.split("/");
      const uploadIdx = parts.findIndex((p) => p === "upload");
      if (uploadIdx === -1) return null;
      const publicIdParts = parts.slice(uploadIdx + 2);
      if (publicIdParts.length === 0) return null;
      const filename = publicIdParts.pop()!;
      const noExt = filename.replace(/\.[^/.]+$/, "");
      return [...publicIdParts, noExt].join("/");
    } catch {
      return null;
    }
  };

  // --- Handlers (upload, preview, copy, delete, move, etc) ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const folder = folderPath.length ? folderPath.join("/") : "default";
      const uploads = Array.from(files).map(async (file) => {
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Max file size is 10MB.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          return null;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", folder);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        if (!data.secure_url) throw new Error("Upload failed");

        // Save URL to backend via RTK Query
        await addMedia({
          url: data.secure_url,
          name: file.name,
          folder: folder,
        }).unwrap();

        return { url: data.secure_url, folder, name: file.name };
      });

      await Promise.all(uploads);
      toast({
        title: "Upload successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refetch();
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePreview = (url: string) => setPreviewUrl(url);

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "Image URL copied to clipboard.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDelete = async (item: MediaItem, refetchAfter = true) => {
    if (!item.id || isNaN(Number(item.id))) {
      toast({
        title: "Delete failed",
        description: "Invalid image ID.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setDeleting(false);
      return;
    }
    setDeleting(true);
    try {
      const publicId = getCloudinaryPublicId(item.url);
      if (publicId) {
        await fetch(
          `${import.meta.env.VITE_BASE_API || "http://localhost:3000"}/images/delete-cloudinary`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('token') || ''}`, // <-- Add this line
            },
            body: JSON.stringify({ publicId }),
          }
        );
      }
      await deleteMedia(item.id).unwrap();
      toast({
        title: "Deleted",
        description: "Media deleted.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      setDeleteTarget(null);
      if (refetchAfter) refetch();
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
    }
  };

  // Helper: get all images in a folder (recursively)
  const getAllImagesInFolder = (node: any): MediaItem[] => {
    let images: MediaItem[] = [];
    if (node.items) {
      images = images.concat(node.items);
    }
    if (node.children) {
      Object.values(node.children).forEach((childNode) => {
        images = images.concat(getAllImagesInFolder(childNode));
      });
    }
    return images;
  };

  // Handler: Delete current folder (all images inside)
  const handleDeleteFolder = async () => {
    setDeleting(true);
    try {
      const node = getCurrentNode(folderTree, folderPath);
      if (!node) throw new Error("Folder not found");
      const imagesToDelete = getAllImagesInFolder(node).filter(img => img.id && !isNaN(Number(img.id)));
      for (const img of imagesToDelete) {
        await handleDelete(img, false);
      }
      if (imagesToDelete.length > 0) {
        await deleteFolder(folderPath.join("/")).unwrap();
      } else {
        // If no images, just remove the virtual folder from state
        setVirtualFolders(prev =>
          prev.filter(arr => arr.join("/") !== folderPath.join("/"))
        );
        toast({
          title: "Folder deleted",
          description: "Empty folder removed.",
          status: "info",
          duration: 2000,
          isClosable: true,
        });
        setFolderPath(folderPath.slice(0, -1));
        setShowDeleteFolderModal(false);
        setDeleting(false);
        return;
      }
      // Remove the folder from virtualFolders state
      setVirtualFolders(prev =>
        prev.filter(arr => arr.join("/") !== folderPath.join("/"))
      );
      toast({
        title: "Folder deleted",
        description: "All images in this folder have been deleted.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      setFolderPath(folderPath.slice(0, -1));
      setShowDeleteFolderModal(false);
      refetch();
    } catch (err: any) {
      // Even if backend fails, remove the virtual folder
      setVirtualFolders(prev =>
        prev.filter(arr => arr.join("/") !== folderPath.join("/"))
      );
      toast({
        title: "Folder deleted",
        description: "Empty folder removed.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      setFolderPath(folderPath.slice(0, -1));
      setShowDeleteFolderModal(false);
    } finally {
      setDeleting(false);
    }
  };

  // Handler: Move selected images to another folder
  const handleMoveImages = async () => {
    if (!moveTargetFolder || selectedImages.length === 0) return;
    try {
      for (const id of selectedImages) {
        await updateMedia({ id, data: { folder: moveTargetFolder } }).unwrap();
      }
      toast({
        title: "Images moved",
        description: "Selected images have been moved.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setSelectedImages([]);
      setShowMoveModal(false);
      refetch();
    } catch (err: any) {
      toast({
        title: "Move failed",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // Handler: Show delete modal for single image
  const handleShowDeleteMediaModal = (item: MediaItem) => {
    setDeleteTarget(item);
    setShowDeleteMediaModal(true);
  };

  // Handler: Confirm delete single image
  const handleConfirmDeleteMedia = async () => {
    if (deleteTarget) {
      await handleDelete(deleteTarget);
      setShowDeleteMediaModal(false);
    }
  };

  // --- UI ---
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white p-4 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-blue-700">Folders</h3>
          <button
            className="ml-2 flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
            onClick={() => {
              const folder = prompt("Enter new folder name (use / for subfolders):");
              if (folder) {
                const newPath = [...folderPath, ...folder.split("/").filter(Boolean)];
                setFolderPath(newPath);
                setVirtualFolders(prev => {
                  if (prev.some(arr => arr.join("/") === newPath.join("/"))) return prev;
                  return [...prev, newPath];
                });
              }
            }}
            title="Create new folder"
          >
            <span className="material-symbols-outlined text-base"></span>
            New
          </button>
        </div>
        <FolderTree
          node={folderTree}
          expanded={expandedFolders}
          setExpanded={setExpandedFolders}
          selectedPath={folderPath}
          setSelectedPath={setFolderPath}
        />
        {folderPath.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            <button
              className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-700 focus:ring-2 focus:ring-red-400 text-xs"
              onClick={() => setShowDeleteFolderModal(true)}
            >
              <span className="material-symbols-outlined text-base"></span>
              Delete Folder
            </button>
            {selectedImages.length > 0 && (
              <button
                className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 text-xs"
                onClick={() => setShowMoveModal(true)}
              >
                <span className="material-symbols-outlined text-base"></span>
                Move Selected
              </button>
            )}
          </div>
        )}
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        <Breadcrumbs folderPath={folderPath} setFolderPath={setFolderPath} />
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleUpload}
            className="border px-2 py-1 rounded"
            disabled={uploading}
          />
        </div>
        {isLoading ? (
          <div className="text-blue-600 font-semibold">Loading media...</div>
        ) : (
          <MediaGrid
            media={currentMedia}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            handlePreview={handlePreview}
            handleCopy={handleCopy}
            setDeleteTarget={handleShowDeleteMediaModal}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
          />
        )}
        {uploading && <div className="mt-4 text-blue-600">Uploading...</div>}
        <MoveModal
          show={showMoveModal}
          onClose={() => setShowMoveModal(false)}
          onMove={handleMoveImages}
          moveTargetFolder={moveTargetFolder}
          setMoveTargetFolder={setMoveTargetFolder}
          getAllFolderPaths={getAllFolderPaths}
          folderTree={folderTree}
        />
        <DeleteFolderModal
          show={showDeleteFolderModal}
          deleting={deleting}
          onCancel={() => setShowDeleteFolderModal(false)}
          onDelete={handleDeleteFolder}
        />
        <DeleteMediaModal
          show={showDeleteMediaModal}
          deleting={deleting}
          target={deleteTarget}
          onCancel={() => setShowDeleteMediaModal(false)}
          onDelete={handleConfirmDeleteMedia}
        />
      </main>
    </div>
  );
};

export default MediaManager;