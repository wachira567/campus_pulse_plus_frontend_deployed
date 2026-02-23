import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import CommentList from "../components/posts/CommentList";
import CommentForm from "./CommentForm";
import ReactionButtons from "./ReactionButtons";
import { AuthContext } from "../../context/AuthContext";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  
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
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 pt-20">
      <h2 className="text-xl font-bold mb-2">Post Detail</h2>
      <p>{post.content}</p>
      <ReactionButtons post={post} refresh={fetchPost} />
      <CommentList comments={post.comments} refresh={fetchPost} />
      {user && <CommentForm postId={post.id} refresh={fetchPost} />}
      {post.admin_response && (
        <p className="mt-2 text-green-600 font-semibold">
          Admin: {post.admin_response}
        </p>
      )}
    </div>
  );
}
