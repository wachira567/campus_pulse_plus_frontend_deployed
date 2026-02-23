import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetchPosts from "../hooks/useFetchPosts";
import PostCard from "../components/posts/PostCard";
import Footer from "../components/layout/Footer";

const categories = [
  {
    name: "Facilities & Maintenance",
    description: "Dorm showers, recycling bins, building repairs",
    examples: "+2 posts",
  },
  {
    name: "Tech Issues",
    description: "WiFi problems, computer labs, online systems",
    examples: "+1 post",
  },
  {
    name: "Safety",
    description: "Campus security, emergency concerns, safety protocols",
    examples: "Active",
  },
  {
    name: "Housing",
    description: "Room assignments, maintenance requests, housing policies",
    examples: "Popular",
  },
];

const HomeFeed = () => {
  const { posts, loading, error } = useFetchPosts();
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <img
            src="https://images.unsplash.com/photo-1565688534245-05d6b5be184a?q=80&w=1200&auto=format&fit=crop"
            alt="Campus Life"
            className="hero-background"
            loading="eager"
          />
        </div>
        <div className="hero-gradient-scrim"></div>
        <div className="hero-content">
          <div className="hero-badge">
            Campus Pulse - Student Voice Platform
          </div>
          <h1 className="hero-headline">
            Your Voice <br />
            <span className="gradient-text">Matters Here</span>
          </h1>
          <p className="hero-subtitle">
            Share campus issues, connect with students, and drive positive
            change anonymously and securely.
          </p>
          <Link to="/create" className="hero-cta-button">
            Share Your Voice
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Explore Topics</h2>
            <p className="section-subtitle">
              Find posts about the issues that matter to you
            </p>
          </div>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className="simple-category-card"
                onClick={() => navigate("/posts")}
              >
                <div className="simple-category-content">
                  <h3 className="simple-category-title">{category.name}</h3>
                  <p className="simple-category-description">
                    {category.description}
                  </p>
                  <div className="simple-category-badge">
                    {category.examples}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="venues-section">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <h2 className="section-title">Recent Posts</h2>
              <p className="section-subtitle">
                Latest voices from the campus community
              </p>
            </div>
            <Link to="/posts" className="view-all-venues-btn">
              View All Posts
            </Link>
          </div>
          <div className="venues-grid">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p>Loading posts...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h3>Posts Unavailable</h3>
                <p>{error}</p>
                <Link
                  to="/create"
                  className="bg-blue-600 text-white px-6 py-3 rounded-full"
                >
                  Share Your Thoughts
                </Link>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <h3>No posts yet</h3>
                <p>Be the first to share your thoughts!</p>
                <Link
                  to="/create"
                  className="bg-blue-600 text-white px-6 py-3 rounded-full"
                >
                  Create First Post
                </Link>
              </div>
            ) : (
              posts
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map((post) => (
                  <div key={post.id} className="venue-card">
                    <PostCard post={post} />
                  </div>
                ))
            )}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="why-us-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Campus Pulse?</h2>
            <p className="section-subtitle">
              A safe space for student voices to be heard and acted upon
            </p>
          </div>
          <div className="why-us-grid">
            <div className="why-us-large">
              <div className="why-us-large-content">
                <div className="why-us-icon">✓</div>
                <h3 className="why-us-title">Anonymous & Secure</h3>
                <p className="why-us-description">
                  Share your thoughts without fear. Our platform ensures your
                  privacy while connecting you with the campus community.
                </p>
                <ul className="why-us-checklist">
                  <li className="why-us-check">Complete anonymity</li>
                  <li className="why-us-check">Secure data handling</li>
                  <li className="why-us-check">Community-driven solutions</li>
                </ul>
              </div>
            </div>
            <div className="why-us-card">
              <div className="why-us-small-icon">⏰</div>
              <h3 className="why-us-small-title">Real-time Updates</h3>
              <p className="why-us-small-description">
                Stay informed about campus issues and see how they're being
                addressed.
              </p>
            </div>
            <div className="why-us-card">
              <div className="why-us-small-icon">👥</div>
              <h3 className="why-us-small-title">Community Impact</h3>
              <p className="why-us-small-description">
                Your voice contributes to positive change across campus.
              </p>
            </div>
            <div className="why-us-social">
              <div className="why-us-social-content">
                <h3 className="why-us-social-title">Join 500+ Students</h3>
                <p className="why-us-social-description">
                  Be part of the growing community making campus better.
                </p>
              </div>
              <div className="why-us-avatars">
                <div className="why-us-avatar">👨‍🎓</div>
                <div className="why-us-avatar">👩‍🎓</div>
                <div className="why-us-avatar">👨‍🎓</div>
                <div className="why-us-avatar-extra">+500</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Simple steps to share your voice and drive change
            </p>
          </div>
          <div className="steps-grid">
            <div className="how-it-works-connector"></div>
            <div className="step-card">
              <div className="step-icon">
                <div className="step-number">1</div>
              </div>
              <h3 className="step-title">Share Your Thoughts</h3>
              <p className="step-description">
                Create a post about any campus issue, suggestion, or experience.
                Stay anonymous if you prefer.
              </p>
            </div>
            <div className="step-card">
              <div className="step-icon">
                <div className="step-number">2</div>
              </div>
              <h3 className="step-title">Connect with Community</h3>
              <p className="step-description">
                See what other students are saying and find common issues
                affecting the campus community.
              </p>
            </div>
            <div className="step-card">
              <div className="step-icon">
                <div className="step-number">3</div>
              </div>
              <h3 className="step-title">Drive Positive Change</h3>
              <p className="step-description">
                Together we can identify issues and work towards solutions that
                improve campus life for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-noise"></div>
        <div className="cta-light-1"></div>
        <div className="cta-light-2"></div>
        <div className="container">
          <div className="cta-content">
            <div>
              <h2 className="cta-title">
                Ready to make your <br />
                <span className="gradient-text">voice heard?</span>
              </h2>
              <p className="cta-subtitle">
                Join the conversation. Share your campus experience and help
                create a better environment for all students.
              </p>
              <div className="cta-buttons">
                <Link to="/create" className="cta-primary">
                  Start Posting
                </Link>
                <Link to="/posts" className="cta-secondary">
                  Browse Posts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomeFeed;