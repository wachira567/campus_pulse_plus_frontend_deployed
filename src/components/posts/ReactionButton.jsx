export default function ReactionButtons({ post, refresh }) {
  async function react(type) {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    await fetch(`${apiUrl}/api/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ post_id: post.id, reaction_type: type }),
    });
    refresh();
  }

  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => react("like")}
        className={`px-2 py-1 rounded text-2xl ${
          post.user_reaction === "like"
            ? "text-orange-500"
            : "text-gray-400 hover:text-orange-300"
        }`}
      >
        ▲ {post.likes}
      </button>
      <button
        onClick={() => react("dislike")}
        className={`px-2 py-1 rounded text-2xl ${
          post.user_reaction === "dislike"
            ? "text-blue-500"
            : "text-gray-400 hover:text-blue-300"
        }`}
      >
        ▼ {post.dislikes}
      </button>
    </div>
  );
}