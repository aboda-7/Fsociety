import { useEffect, useState } from 'react'
import "./profile.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LikeButton from "../components/likeButton.jsx"
import Modal from "react-modal"

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [error, setError] = useState("");
  const [posts , setPosts] = useState([]);
  const [isModalOpen , setIsModalOpen] = useState(false);
  const [selectedPostComments, setSelectedPostComments] = useState([]);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newPostContent, setNewPostContent] = useState(""); // New post content
  const [isPostModalOpen, setIsPostModalOpen] = useState(false); // Manage post modal visibility
  const username = window.location.pathname.split("/").pop();
  const [userProfilePicture, setUserProfilePicture] = useState(null);

  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  const userId = getUserId();
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.get(`http://localhost:4000/profile/getProfile/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUser(response.data.data);
        setRole(response.data.data.role);

        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`http://localhost:4000/profile/getProfileById/${userId}`,{
            headers: {Authorization: `Bearer ${token}`},
          });
          setUserProfilePicture(response.data.data.profile?.profilePicture);
        } catch (error) {
          console.error("Couldn't get user profile picture");
        }

      } catch (err) {
        setError("Failed to fetch profile");
        console.error(err);
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    };

    fetchProfile();
  }, [username]);

  const handleLogOut = async (e) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:4000/profile/logOut`, {
        headers: { Authorization: `Bearer ${token}` } 
      });
      console.log(response.data);
      navigate('/');
    } catch (error) {
      console.log(`Couldn't sign Out" ${error}`);
    }
  }

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const postsResponse = await axios.get(`http://localhost:4000/post/getUserPosts/${username}`,{
        headers: {Authorization: `Bearer ${token}`},
      });
      setPosts(postsResponse.data.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const token = localStorage.getItem("token");
      const fetchedComments = await Promise.all(
        selectedPostComments.map(async (commentId) => {
          try {
            const response = await axios.get(
              `http://localhost:4000/comment/getComment/${commentId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const commentData = response.data.data;

            const profileResponse = await axios.get(
              `http://localhost:4000/profile/getProfileById/${commentData.comment.writer}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
        
            const profilePicture = profileResponse.data.data.profile.profilePicture;
            const userName = profileResponse.data.data.username;

            return {
              text: commentData.comment.content,
              profilePicture: profilePicture,
              writer: userName, 
            };

          } catch (error) {
            console.error(`Error fetching comment ${commentId}: ${error}`);
            return { id: commentId, text: "Error loading comment" };
          }
        })
      );
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
    setLoadingComments(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchComments();
    }
  }, [isModalOpen]);

  const openModal = (post) => {
    setSelectedPostComments(post.comments); // Store comment IDs
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPostComments(null);
  };

  // New Post Modal Handlers
  const openPostModal = () => setIsPostModalOpen(true);
  const closePostModal = () => {
    setIsPostModalOpen(false);
    setNewPostContent("");  // Reset the new post content
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
      closePostModal();  // Close the modal after submitting the post
      fetchPosts();  // Refresh the posts
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleHome = () => {
    navigate('/home');
  };

  // Delete Post Handler
  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://localhost:4000/post/deletePost/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        // Remove the deleted post from the state
        setPosts(posts.filter(post => post._id !== postId));
        console.log("Post deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete post");
    }
  };

  return user ? (
    <div className="container">
      <aside className="sidebar">
        <div className="profile-pic">
          <img src={userProfilePicture} style={{ width: "100%", height: "100%", objectFit: 'cover' }} />
        </div>
        <nav>
          <a onClick={handleHome}>Home</a>
          <a href="#">Profile Page</a>
          <a href="#">Settings</a>
          <a onClick={handleLogOut}>Logout</a>
        </nav>
        <p>Followers: {user.followers}</p>
        <p>Following: {user.following}</p>

        {/* New Post Button under Followers and Following */}
        <button onClick={openPostModal} className="new-post-button">
          + New Post
        </button>
      </aside>

      <main className="main-content">
        <section className="profile-section">
          <div className="profile-pic">
            <img src={user.profile?.profilePicture} style={{ width: "100%", height: "100%", objectFit: 'cover' }} />
          </div>
          <h1>{username}</h1>
          <p>{user.profile.bio}</p>
        </section>

        <button onClick={openPostModal} className="new-post-button">
          + New Post
        </button>

        <section className="posts">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div className="post" key={index}>
                <div className="profile-pic small">
                  <img src={user.profile?.profilePicture} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div className="post-content">
                  <h3>{user.username}</h3>
                  <p>{post.content}</p>
                  <div className="post-actions">
                    <LikeButton postId={post._id} initialLikes={post.likes} userId={userId} />
                    <button onClick={() => openModal(post)}>Comment ({post.comments.length})</button>
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => handleDeletePost(post._id)} 
                      className="delete-button"
                                          >
                          Delete </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </section>
      </main>

      {/* New Post Modal */}
      {isPostModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={closePostModal}>X</button>
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

      {/* Comment Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={closeModal}>X</button>
            <h3>Comments</h3>
            {loadingComments ? (
              <p>Loading comments...</p>
            ) : comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="comment-container">
                  <img src={comment.profilePicture} alt="Profile" className="profile-pic small" />
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
    </div>
  ) : (
    <p style={{ color: 'white' }}>Loading...</p>
  );
};

export default ProfilePage;
