import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import ReactionButtons from "./ReactionButton";
import { AuthContext } from "../../context/AuthContext";
import { Expand } from "lucide-react";
import Footer from "../layout/Footer";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [imageModal, setImageModal] = useState(null);

  async function fetchPost() {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/posts/${id}`, {
      credentials: "include",
    });
    const data = await res.json();
    setPost(data);
  }

  useEffect(() => {
    fetchPost();
    const interval = setInterval(fetchPost, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="pt-20 md:pt-16">
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-2">Post Detail</h2>
        <p>{post.content}</p>

        {/* Image Display */}
        {post.images && post.images.length > 0 && (
          <div className="mt-4 mb-4">
            <div className="relative max-w-full">
              <img
                src={post.images[0]}
                alt="Post content"
                className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg"
              />
              <button
                onClick={() => setImageModal(post.images[0])}
                className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <Expand size={20} />
              </button>
            </div>
          </div>
        )}

        <ReactionButtons post={post} refresh={fetchPost} />
        <CommentList comments={post.comments} refresh={fetchPost} />
        {user && <CommentForm postId={post.id} refresh={fetchPost} />}
        {post.admin_response && (
          <p className="mt-2 text-green-600 font-semibold">
            Admin: {post.admin_response}
          </p>
        )}

        {/* Image Modal */}
        {imageModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setImageModal(null)}>
            <div className="relative max-w-4xl max-h-full p-4">
              <img
                src={imageModal}
                alt="Expanded post content"
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
      <Footer />
    </div>
  );
}