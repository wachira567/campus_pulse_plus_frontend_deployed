import { useContext, useState } from "react";
import { Trash2, Expand } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function CommentList({ comments, refresh }) {
  const { user } = useContext(AuthContext);
  const [imageModal, setImageModal] = useState(null);

  const handleDelete = async (id) => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const response = await fetch(`${apiUrl}/api/comments/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      toast.success("Comment deleted!", { duration: 2000 });
      if (refresh) refresh();
    } else {
      toast.error("Failed to delete comment", { duration: 3000 });
    }
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Comments</h3>
      {comments.length === 0 && <p>No comments yet.</p>}
      {comments.map((c) => (
        <div key={c.id} className="border p-3 rounded mb-3 bg-gray-50 relative">
          <p className="mb-2">{c.content}</p>

          {/* Comment Images */}
          {c.images && c.images.length > 0 && (
            <div className="mb-2 flex gap-2 flex-wrap">
              {c.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Comment attachment ${index + 1}`}
                  className="w-16 h-16 object-cover rounded cursor-pointer border"
                  onClick={() => setImageModal(image)}
                />
              ))}
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {new Date(c.created_at).toLocaleString()}
            </span>
            {user && Number(user.id) === Number(c.user_id) && (
              <button
                onClick={() => handleDelete(c.id)}
                className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Image Modal */}
      {imageModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setImageModal(null)}>
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
    </div>
  );
}