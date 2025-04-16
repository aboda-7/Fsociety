import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import LikeButton from "../components/likeButton.jsx";
import Modal from "react-modal";

const HomePage = () => {
  const navigate = useNavigate(); // Declare navigate
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");  // State for username
  const [userProfilePicture, setUserProfilePicture] = useState("");
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedPostComments, setSelectedPostComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  // New Post States
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");

  // Effect to set user info from JWT token
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        console.log(token);
      
        const username = localStorage.getItem("username");

        const response = await axios.get(`http://localhost:4000/profile/getProfile/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUser(response.data.data);
        setUserProfilePicture(response.data.data.profile?.profilePicture);
        console.log(response.data.data.profile?.profilePicture);

      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    };

    fetchProfile();
  }, [username]);

  const handleLogOut = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.get("http://localhost:4000/profile/logOut", {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/"); // Navigate to the login page or home after log out
    } catch (error) {
      console.error("Couldn't sign out:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:4000/post/getUserPosts/${username}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sortedPosts = res.data.data.posts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (username) fetchPosts();  // Ensure posts are fetched only when username is set
  }, [username]);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const token = localStorage.getItem("token");
      const fetched = await Promise.all(
        selectedPostComments.map(async (commentId) => {
          try {
            const res = await axios.get(
              `http://localhost:4000/comment/getComment/${commentId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = res.data.data.comment;

            const profileRes = await axios.get(
              `http://localhost:4000/profile/getProfileById/${data.writer}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const profile = profileRes.data.data.profile;

            return {
              text: data.content,
              profilePicture: profile.profilePicture,
              writer: profileRes.data.data.username,
            };
          } catch (error) {
            console.error(`Error loading comment ${commentId}:`, error);
            return { text: "Error loading comment", writer: "Unknown" };
          }
        })
      );
      setComments(fetched);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
    setLoadingComments(false);
  };

  useEffect(() => {
    if (isModalOpen) fetchComments();
  }, [isModalOpen]);

  const openModal = (post) => {
    setSelectedPostComments(post.comments);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPostComments([]);
  };


  // New post modal handlers
  const openPostModal = () => setIsPostModalOpen(true);
  const closePostModal = () => {
    setIsPostModalOpen(false);
    setNewPostContent("");
  };

  const handlePostSubmit = async () => {
    if (!newPostContent.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:4000/post/createPost",
        { content: newPostContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      closePostModal();
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return user ? (
    <div className="container">
      <aside className="sidebar">
        <div className="profile-pic">
          <img
            src={userProfilePicture || "/default-avatar.png"}
            alt="Profile"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <nav>
          <a href="#">Home</a>
          <a href="#"/*onClick={handleProfileClick}*/>Profile</a> {/* Updated this */}
          <a href="#">Settings</a>
          <a onClick={handleLogOut}>Logout</a>
        </nav>
        <p>Followers: {user.followers || 0}</p>
        <p>Following: {user.following || 0}</p>

        {/* New Post Button under Followers/Following */}
        <button onClick={openPostModal} className="new-post-button">
          + New Post
        </button>
      </aside>

      <main className="main-content">
        <section className="posts">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div className="post" key={post._id}>
                <div className="profile-pic small">
                  <img
                    src={user.profile?.profilePicture || "/default-avatar.png"}
                    alt="User"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="post-content">
                  <h3>{user.username}</h3>
                  <p>{post.content}</p>
                  <div className="post-actions">
                    <LikeButton postId={post._id} initialLikes={post.likes} userId={userId} />
                    <button onClick={() => openModal(post)}>
                      Comment ({post.comments.length})
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </section>
      </main>

      {/* Comment Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={closeModal}>
              X
            </button>
            <h3>Comments</h3>
            {loadingComments ? (
              <p>Loading comments...</p>
            ) : comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="comment-container">
                  <img
                    src={comment.profilePicture || "/default-avatar.png"}
                    alt="Commenter"
                    className="profile-pic small"
                  />
                  <div className="comment-content">
                    <p className="comment-username">{comment.writer}</p>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {isPostModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={closePostModal}>
              X
            </button>
            <h3>Create a New Post</h3>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={5}
              style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
            />
            <button 
              onClick={handlePostSubmit} 
              className="post-button"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <p style={{ color: "white" }}>Loading...</p>
  );
};

export default HomePage;
