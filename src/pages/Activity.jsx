import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/layout/Footer";
import {
  MessageSquare,
  Heart,
  AlertTriangle,
  Users,
  Calendar,
  TrendingUp,
  FileText,
  MapPin,
} from "lucide-react";

const Activity = () => {
  const { user } = useContext(AuthContext);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/user/activity`, {
          credentials: "include",
        });
        const data = await response.json();
        setActivity(data);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchActivity();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in
          </h2>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your activity...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "all",
      label: "All Activity",
      count:
        (activity?.posts?.length || 0) +
        (activity?.comments?.length || 0) +
        (activity?.reactions?.length || 0) +
        (activity?.security_reports?.length || 0) +
        (activity?.escort_requests?.length || 0),
    },
    { id: "posts", label: "Posts", count: activity?.posts?.length || 0 },
    {
      id: "comments",
      label: "Comments",
      count: activity?.comments?.length || 0,
    },
    {
      id: "reactions",
      label: "Reactions",
      count: activity?.reactions?.length || 0,
    },
    {
      id: "security",
      label: "Security Reports",
      count: activity?.security_reports?.length || 0,
    },
    {
      id: "escort",
      label: "BuddyUp",
      count: activity?.escort_requests?.length || 0,
    },
  ];

  const renderActivityItem = (item, type) => {
    const getIcon = () => {
      switch (type) {
        case "post":
          return <FileText className="w-5 h-5 text-blue-600" />;
        case "comment":
          return <MessageSquare className="w-5 h-5 text-green-600" />;
        case "reaction":
          return <Heart className="w-5 h-5 text-red-600" />;
        case "security":
          return <AlertTriangle className="w-5 h-5 text-orange-600" />;
        case "escort":
          return <Users className="w-5 h-5 text-purple-600" />;
        default:
          return <FileText className="w-5 h-5 text-gray-600" />;
      }
    };

    const getContent = () => {
      switch (type) {
        case "post":
          return (
            <div>
              <p className="text-gray-900 font-medium">
                Posted: "{item.content}"
              </p>
              <p className="text-sm text-gray-600">
                Category: {item.category_name}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <span>👍 {item.likes}</span>
                <span>👎 {item.dislikes}</span>
                <span>💬 {item.comments_count}</span>
              </div>
            </div>
          );
        case "comment":
          return (
            <div>
              <p className="text-gray-900 font-medium">
                Commented: "{item.content}"
              </p>
              <p className="text-sm text-gray-600">
                On post: "{item.post_content}"
              </p>
            </div>
          );
        case "reaction":
          return (
            <div>
              <p className="text-gray-900 font-medium">
                {item.reaction_type === "like" ? "👍 Liked" : "👎 Disliked"}: "
                {item.post_content}"
              </p>
            </div>
          );
        case "security":
          return (
            <div>
              <p className="text-gray-900 font-medium capitalize">
                {item.type} Report
              </p>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-xs text-gray-500">
                📍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
              </p>
            </div>
          );
        case "escort":
          return (
            <div>
              <p className="text-gray-900 font-medium">BuddyUp Request</p>
              <p className="text-sm text-gray-600">{item.message}</p>
              <p className="text-xs text-gray-500 capitalize">
                Status: {item.status}
              </p>
            </div>
          );
        default:
          return <p className="text-gray-900">Unknown activity</p>;
      }
    };

    return (
      <div
        key={`${type}-${item.id}`}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            {getContent()}
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{new Date(item.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getFilteredActivity = () => {
    if (!activity) return [];

    switch (activeTab) {
      case "posts":
        return activity.posts.map((item) => ({ ...item, type: "post" }));
      case "comments":
        return activity.comments.map((item) => ({ ...item, type: "comment" }));
      case "reactions":
        return activity.reactions.map((item) => ({
          ...item,
          type: "reaction",
        }));
      case "security":
        return activity.security_reports.map((item) => ({
          ...item,
          type: "security",
        }));
      case "escort":
        return activity.escort_requests.map((item) => ({
          ...item,
          type: "escort",
        }));
      default:
        return [
          ...activity.posts.map((item) => ({ ...item, type: "post" })),
          ...activity.comments.map((item) => ({ ...item, type: "comment" })),
          ...activity.reactions.map((item) => ({ ...item, type: "reaction" })),
          ...activity.security_reports.map((item) => ({
            ...item,
            type: "security",
          })),
          ...activity.escort_requests.map((item) => ({
            ...item,
            type: "escort",
          })),
        ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  };

  const filteredActivity = getFilteredActivity();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Activity</h1>
              <p className="text-gray-600 mt-1">
                Track all your campus community interactions
              </p>
            </div>
            <Link
              to="/profile"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {activity?.posts?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {activity?.comments?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Comments</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {activity?.reactions?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Reactions</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {activity?.security_reports?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Security</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {activity?.escort_requests?.length || 0}
            </div>
            <div className="text-sm text-gray-600">BuddyUp</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {(activity?.posts?.length || 0) +
                (activity?.comments?.length || 0) +
                (activity?.reactions?.length || 0) +
                (activity?.security_reports?.length || 0) +
                (activity?.escort_requests?.length || 0)}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          {filteredActivity.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No activity yet
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === "all"
                  ? "Start engaging with the campus community!"
                  : `You haven't ${
                      activeTab === "posts"
                        ? "created any posts"
                        : activeTab === "comments"
                          ? "made any comments"
                          : activeTab === "reactions"
                            ? "reacted to any posts"
                            : activeTab === "security"
                              ? "submitted security reports"
                              : "made any buddyup requests"
                    } yet.`}
              </p>
              <div className="flex gap-2 justify-center">
                <Link
                  to="/create"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Post
                </Link>
                <Link
                  to="/streetwise"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Streetwise
                </Link>
              </div>
            </div>
          ) : (
            filteredActivity.map((item) => renderActivityItem(item, item.type))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Activity;
