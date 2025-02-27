import { useEffect, useState } from 'react'
import "./profile.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const username = window.location.pathname.split("/").pop();

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
    const response = await axios.get("http://localhost:4000/profile/logOut", {
      headers: { Authorization: `Bearer ${token}` } 
    });
    console.log(response.data);
    navigate('/');
  } catch (error) {
    console.log(`Couldn't sign Out" ${error}`);
  }
 }
  
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
          <a onClick={handleLogOut}>Logout</a>
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
          {[1].map((post, index) => (
            <div className="post" key={index}>
              <div className="profile-pic small"></div>
              <div className="post-content">
                <h3>{username}</h3>
                <p>Cats are the best pets in my opinion...</p>
                <div className="post-actions">
                  <button>Like</button>
                  <button>Comment</button>
                  <button>Share</button>
                </div>
              </div>
            </div>
          ))}
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
