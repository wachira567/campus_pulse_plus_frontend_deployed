import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const response = await fetch(`${apiUrl}/api/posts/${post.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      toast.success("Post deleted!", { duration: 2000 });
      window.location.reload(); // Or better, refresh parent list
    } else {
      toast.error("Failed to delete post", { duration: 3000 });
    }
  };

  return (
    <div
      onClick={() => navigate(`/posts/${post.id}`)}
      className="bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all border border-gray-200 relative cursor-pointer"
    >

      {/* Content Section */}
      <div className="p-8">
        <div className="mb-8">
          <p className="text-lg leading-[1.7] text-gray-900 font-normal m-0 line-clamp-4 overflow-hidden text-ellipsis">
            {post.content}
          </p>
        </div>

        {/* Meta Information */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <MessageSquare size={16} className="text-gray-400 flex-shrink-0" />
            <span className="font-medium text-gray-700">Post</span>
          </div>

          <div className="flex items-center gap-2">
            {user && Number(user.id) === Number(post.user_id) && (
              <button
                onClick={handleDelete}
                className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar size={16} className="text-gray-400 flex-shrink-0" />
              <div className="flex flex-col items-start gap-0.5">
                <span className="font-medium text-gray-700 text-[0.8125rem] leading-[1.2]">
                  {formatDate(post.created_at)}
                </span>
                <span className="text-[0.75rem] text-gray-400 leading-[1.2]">
                  {formatTime(post.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;