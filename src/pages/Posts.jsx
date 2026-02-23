import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useFetchPosts from "../hooks/useFetchPosts";
import PostCard from "../components/posts/PostCard";
import Footer from "../components/layout/Footer";

// Categories for filtering
const categories = [
  { id: "all", name: "All Categories" },
  { id: "facilities", name: "Facilities & Maintenance" },
  { id: "tech", name: "Tech Issues" },
  { id: "safety", name: "Safety" },
  { id: "housing", name: "Housing" },
];

const Posts = () => {
  const { posts, loading, error } = useFetchPosts();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    if (posts) {
      let filtered = posts.filter((post) => {
        // Search filter
        const matchesSearch = post.content
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        // Category filter
        const matchesCategory =
          categoryFilter === "all" ||
          post.category_id === categoryFilter ||
          post.category_name?.toLowerCase().includes(categoryFilter.toLowerCase());
        return matchesSearch && matchesCategory;
      });

      // Sort posts
      filtered.sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === "oldest") {
          return new Date(a.created_at) - new Date(b.created_at);
        } else if (sortBy === "most_likes") {
          return (b.likes || 0) - (a.likes || 0);
        } else if (sortBy === "most_comments") {
          return (b.comments_count || 0) - (a.comments_count || 0);
        }
        return 0;
      });

      setFilteredPosts(filtered);
    }
  }, [posts, searchTerm, sortBy, categoryFilter]);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Error loading posts</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
            alt="Community Posts"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        <div className="relative z-30 text-center px-4 max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white no-underline font-medium text-sm mb-8 transition-all hover:bg-white/20"
          >
            Back to Home
          </Link>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 drop-shadow-lg tracking-tight leading-tight">
            Community <br />
            <span className="bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent font-extrabold">
              Voice
            </span>
          </h1>
          <p className="text-xl text-white/90 font-medium leading-relaxed max-w-2xl mx-auto">
            Discover what your fellow students are saying. Every post matters
            in building a better campus community.
          </p>
        </div>
      </section>

      {/* Search & Filters Section */}
      <section className="py-16 bg-white relative z-20 rounded-t-[3rem] -mt-8 shadow-[-20px_0_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Search Bar */}
            <div className="p-8 border-b border-gray-200">
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search posts by content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-4 pr-4 pl-12 border-2 border-gray-200 rounded-full text-base bg-gray-50 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="p-6 flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm cursor-pointer transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Sort Filter */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm cursor-pointer transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most_likes">Most Likes</option>
                  <option value="most_comments">Most Comments</option>
                </select>

                {/* Clear Filters Button */}
                {(searchTerm || categoryFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("all");
                    }}
                    className="px-4 py-3 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold text-sm no-underline transition-all hover:from-blue-600 hover:to-blue-700 hover:-translate-y-1 hover:shadow-xl shadow-lg"
              >
                Share Your Voice
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Posts Grid Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-24 px-8 bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-lg mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-300 rounded-3xl flex items-center justify-center text-gray-400 mx-auto mb-8">
                📝
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {searchTerm ? "No posts match your search" : "No posts yet"}
              </h3>
              <p className="text-lg text-gray-500 leading-relaxed mb-8">
                {searchTerm
                  ? "Try adjusting your search terms or browse all posts"
                  : "Be the first to share your thoughts and start the conversation!"}
              </p>
              {!searchTerm && (
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold text-base no-underline transition-all hover:from-blue-600 hover:to-blue-700 hover:-translate-y-1 hover:shadow-xl shadow-lg"
                >
                  Create First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 border border-gray-200">
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Posts;
