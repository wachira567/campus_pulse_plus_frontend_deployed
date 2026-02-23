import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Image as ImageIcon, X, Upload } from "lucide-react";

export default function CommentForm({ postId, refresh }) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageModal, setImageModal] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setUploadedFile(file);
      setImageUrl(URL.createObjectURL(file));
      toast.success("Image selected!");
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    console.log("Cloudinary config:", { cloudName, uploadPreset });

    if (
      !cloudName ||
      !uploadPreset ||
      cloudName === "your-cloud-name" ||
      uploadPreset === "your-upload-preset"
    ) {
      throw new Error(
        "Image upload not configured. Please set up Cloudinary credentials in .env file.",
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    console.log("Uploading to Cloudinary...");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    console.log("Cloudinary response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary upload failed:", errorText);
      throw new Error(
        `Failed to upload image: ${response.status} ${errorText}`,
      );
    }

    const data = await response.json();
    console.log("Cloudinary upload success:", data.secure_url);
    return data.secure_url;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      let finalImageUrl = null;

      if (uploadedFile) {
        setUploading(true);
        finalImageUrl = await uploadToCloudinary(uploadedFile);
        setUploading(false);
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content,
          post_id: postId,
          image: finalImageUrl,
        }),
      });

      if (response.ok) {
        toast.success("Comment added!");
        setContent("");
        setImageUrl("");
        setUploadedFile(null);
        refresh();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to add comment");
      }
    } catch (error) {
      console.error("Comment submission error:", error);
      if (error.message.includes("Image upload not configured")) {
        toast.error(error.message);
      } else if (error.message.includes("Failed to upload image")) {
        toast.error(
          "Failed to upload image to Cloudinary. Please check your configuration.",
        );
      } else {
        toast.error("Network error. Please try again.");
      }
      setUploading(false);
    }
  }

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="border p-2 flex-1 rounded"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200"
          >
            <ImageIcon size={16} />
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Comment"}
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />

        {/* Image Preview */}
        {imageUrl && (
          <div className="relative inline-block">
            <img
              src={imageUrl}
              alt="Comment preview"
              className="w-20 h-20 object-cover rounded cursor-pointer border"
              onClick={() => setImageModal(imageUrl)}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        )}

        {/* Image Modal */}
        {imageModal && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setImageModal(null)}
          >
            <div className="relative max-w-4xl max-h-full p-4">
              <img
                src={imageModal}
                alt="Expanded comment image"
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setImageModal(null)}
                className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/40 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
