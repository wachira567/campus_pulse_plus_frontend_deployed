import { useEffect, useState } from "react";
import PostCard from "./PostCard";

export default function PostList({ categoryId }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      let url = `${apiUrl}/api/posts`;
      if (categoryId) url += `?category_id=${categoryId}`;
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      setPosts(data);
    }
    fetchPosts();
  }, [categoryId]);

  return (
    <div>
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}