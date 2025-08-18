import React, { useState, useRef, useMemo } from "react";
import { useToast, Spinner, Progress } from "@chakra-ui/react";
import { useGetMediaQuery, useAddMediaMutation, useDeleteMediaMutation, useUpdateMediaMutation, useDeleteFolderMutation } from "../../../redux/api/mediaApi";
import type { MediaItem } from "../../../redux/api/mediaApi";
import FolderTree from "./FolderTree";
import Breadcrumbs from "./Breadcrumbs";
import MediaGrid from "./MediaGrid";
import MoveModal from "./MoveModal";
import DeleteFolderModal from "./DeleteFolderModal";
import DeleteMediaModal from "./DeleteMediaModal";
import { Box, Flex } from "@chakra-ui/react";
import Loading from "../../widgets/loading";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "diishpkrl";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your_unsigned_preset";

// Helper to build a folder tree from flat media list
function buildFolderTree(media: MediaItem[]): FolderTreeNode {
  const root: FolderTreeNode = { children: {} };
  media.forEach((item) => {
    const parts = (item.folder || "default").split("/").filter(Boolean);
    let node = root;
    for (const part of parts) {
      node.children = node.children || {};
      node.children[part] = node.children[part] || { children: {} };
      node = node.children[part];
    }
    node.items = node.items || [];
    node.items.push(item);
  });
  return root;
}

export type FolderTreeNode = {
  children: Record<string, FolderTreeNode>;
  items?: MediaItem[];
};

// Helper: get all folder paths as array of strings
function getAllFolderPaths(tree: FolderTreeNode, prefix: string[] = []): string[] {
  let paths: string[] = [];
  if (prefix.length) paths.push(prefix.join("/"));
  if (tree.children) {
    Object.keys(tree.children).forEach((folder) => {
      paths = paths.concat(getAllFolderPaths(tree.children![folder], [...prefix, folder]));
    });
  }
  return paths;
}

const MediaManager: React.FC = () => {
  // --- State ---
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // NEW: upload progress state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);
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
  const [updateMedia] = useUpdateMediaMutation();
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
  const getCurrentNode = (tree: FolderTreeNode, path: string[]): FolderTreeNode => {
    let node = tree;
    for (const part of path) {
      if (!node.children[part]) return { children: {}, items: [] };
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
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, productSlug?: string) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const folder = productSlug
        ? productSlug
        : folderPath.length ? folderPath.join("/") : "default";
      let completed = 0;

      const uploads = Array.from(files).map((file, _, arr) => {
        return new Promise<void>((resolve, reject) => {
          if (file.size > 10 * 1024 * 1024) {
            toast({
              title: "File too large",
              description: "Max file size is 10MB.",
              status: "error",
              duration: 4000,
              isClosable: true,
            });
            setUploadProgress(0);
            return reject();
          }
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
          formData.append("folder", folder);

          // Use XMLHttpRequest for progress
          const xhr = new XMLHttpRequest();
          xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`);
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              // Progress for this file
              const percent = (event.loaded / event.total) * 100;
              // Average progress across all files
              setUploadProgress(Math.round(((completed + percent / 100) / arr.length) * 100));
            }
          };
          xhr.onload = () => {
            (async () => {
              completed += 1;
              setUploadProgress(Math.round((completed / arr.length) * 100));
              if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                try {
                  await addMedia({
                    url: data.secure_url,
                    name: file.name,
                    folder: folder,
                  }).unwrap();
                  resolve();
                } catch (err) {
                  reject(err);
                }
              } else {
                reject(new Error("Upload failed"));
              }
            })();
          };
          xhr.onerror = () => reject(new Error("Upload failed"));
          xhr.send(formData);
        });
      });

      await Promise.all(uploads);
      setUploadProgress(100);
      toast({
        title: "Upload successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refetch();
    } catch (err: unknown) {
      toast({
        title: "Upload failed",
        description: err && typeof err === "object" && "message" in err ? (err as { message?: string }).message : "Unknown error",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
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
        const baseApi = (import.meta.env.VITE_BASE_API || "https://pengoo-back-end.vercel.app").replace(/\/+$/, "");
        await fetch(
          `${baseApi}/images/delete-cloudinary`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('token') || ''}`,
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
    } catch (err: unknown) {
      toast({
        title: "Delete failed",
        description: err && typeof err === "object" && "message" in err ? (err as { message?: string }).message : "Unknown error",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
    }
  };

  // Helper: get all images in a folder (recursively)
  const getAllImagesInFolder = (node: FolderTreeNode): MediaItem[] => {
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
    } catch {
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
    } catch (err: unknown) {
      toast({
        title: "Move failed",
        description: err && typeof err === "object" && "message" in err ? (err as { message?: string }).message : "Unknown error",
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

  // --- LOADING TRANSITION ---
  if (isLoading) return <Loading />;

  // --- UI ---
  return (
    <Flex minH="100vh" bgGradient="linear(to-br, blue.50, white)">
      {/* Sidebar: Folder Tree */}
      <Box
        as="aside"
        w={{ base: "full", md: "320px" }}
        minW="240px"
        maxW="360px"
        borderRight="1px solid #e2e8f0"
        bg="white"
        p={6}
        display="flex"
        flexDirection="column"
        boxShadow="2xl"
        zIndex={2}
        className="sticky top-0 h-screen overflow-y-auto"
      >
        <Flex align="center" justify="space-between" mb={4}>
          <Box fontWeight="bold" fontSize="xl" color="blue.700">
            <span className="flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
              </svg>
              Media Folders
            </span>
          </Box>
          <button
            className="ml-2 flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition"
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
            +
          </button>
        </Flex>
        <FolderTree
          node={folderTree}
          expanded={expandedFolders}
          setExpanded={setExpandedFolders}
          selectedPath={folderPath}
          setSelectedPath={setFolderPath}
        />
      </Box>
      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10">
        {/* Breadcrumbs and Folder Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="bg-white rounded-lg shadow px-4 py-2 flex-1">
            <Breadcrumbs folderPath={folderPath} setFolderPath={setFolderPath} />
          </div>
          {/* Folder Actions */}
          <div className="flex gap-2">
            {folderPath.length > 0 && (
              <button
                className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg shadow hover:bg-red-700 focus:ring-2 focus:ring-red-400 text-xs transition"
                onClick={() => setShowDeleteFolderModal(true)}
              >
                Delete Folder
              </button>
            )}
            {selectedImages.length > 0 && (
              <button
                className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 text-xs transition"
                onClick={() => setShowMoveModal(true)}
              >
                Move Images
              </button>
            )}
          </div>
        </div>
        {/* Upload Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white rounded-lg shadow px-6 py-4 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm font-semibold">
              Upload Images
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={e => handleUpload(e)}
              className="hidden"
              disabled={uploading}
              ref={fileInputRef}
            />
          </label>
          {uploading && (
            <div className="w-full max-w-xs">
              <div className="flex items-center gap-2 mb-1">
                <Spinner color="blue.500" size="sm" />
                <span className="text-blue-600 font-semibold">Uploading... {uploadProgress}%</span>
              </div>
              <Progress
                value={uploadProgress}
                size="sm"
                colorScheme="blue"
                borderRadius="full"
                hasStripe
                isAnimated
              />
            </div>
          )}
        </div>
        {/* Media Grid */}
        {currentMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
            </svg>
            <div>No media found in this folder.</div>
          </div>
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
        {/* Modals */}
        <MoveModal
          show={showMoveModal}
          onClose={() => setShowMoveModal(false)}
          onMove={handleMoveImages}
          moveTargetFolder={moveTargetFolder}
          setMoveTargetFolder={setMoveTargetFolder}
          getAllFolderPaths={(tree: unknown) => getAllFolderPaths(tree as FolderTreeNode)}
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
    </Flex>
  );
};

export default MediaManager;