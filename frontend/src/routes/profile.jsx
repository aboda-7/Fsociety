import { useEffect, useState } from 'react'
import "./profile.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LikeButton from '../components/likeButton';

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [error, setError] = useState("");
  const [posts , setPosts] = useState([]);
  const username = window.location.pathname.split("/").pop();
  

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
        
        
        // console.log("Profile Data:", response.data.data); // Debugging
        setUser(response.data.data);
        setRole(response.data.data.role);
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
    // console.log(`Token : ${token}`)
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
      headers: {Authorization: `Bearer ${token}`}
    })
    setPosts(postsResponse.data.data.posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

useEffect(() => {
  fetchPosts();
}, []);

const handleLike = async (postId) => {
  const userId = getUserId();
  // console.log(userId)
  if (!userId) return;

  setPosts((prevPosts) =>
    prevPosts.map((post) =>
      post._id === postId
        ? {
            ...post,
            likes: post.likes.includes(userId)
              ? post.likes.filter((id) => id !== userId) // Unlike
              : [...post.likes, userId], // Like
          }
        : post
    )
  );

  try {
    const token = localStorage.getItem("token");

    await axios.patch(
      `http://localhost:4000/post/likePost/${postId}`,
      {}, // Empty body
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Error liking post:", error);

    // Revert UI if request fails
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              likes: post.likes.includes(userId)
                ? [...post.likes, userId] // Re-add like
                : post.likes.filter((id) => id !== userId), // Remove like
            }
          : post
      )
    );
  }
};

 const isProfilePage = role === 'user';

  return user ? (
    <div className="container">
      <aside className="sidebar">
        <div className="profile-pic">
        <img src={user.profile?.profilePicture}  style={{ width: "100%", height: "100%",objectFit: 'cover' }}/>
        </div>
        <nav>
          <a href="#">Home</a>
          <a href="#">Profile Page</a>
          <a href="#">Settings</a>
          {isProfilePage && <a onClick={handleLogOut}>Logout</a>}
        </nav>
        <p>Followers: {user.followers}</p>
        <p>Following: {user.following}</p>
      </aside>

      <main className="main-content">
        <section className="profile-section">
          <h1>{username}</h1>
          <button className="edit-btn">Edit</button>
          <p>{user.profile.bio}</p>
        </section>

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
                  <button>Comment</button>
                  <button>Share</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </section>
      </main>

      <aside className="edit-section">
        <h3>Edit Username</h3>
        <input
          type="text"
          placeholder="New username"
        />
        <h3>Edit Biography</h3>
        <textarea
          placeholder="New biography"
        ></textarea>
        <button>Save</button>
      </aside>
    </div>
  ) : (
    <p style={{color: 'white'}}>Loading...</p>
  )
};

export default ProfilePage;
