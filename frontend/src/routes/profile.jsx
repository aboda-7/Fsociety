import { useEffect, useState } from 'react';
import "./profile.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Posts from "../components/post";
import Sidebar from "../components/sidebar"; // Import the new Sidebar component

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [error, setError] = useState("");
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
          const profileResponse = await axios.get(`http://localhost:4000/profile/getProfileById/${userId}`,{
            headers: {Authorization: `Bearer ${token}`},
          });
          setUserProfilePicture(profileResponse.data.data.profile?.profilePicture);
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
  }, [username, userId]);

  return user ? (
    <div className="container">
      <Sidebar 
        userProfilePicture={userProfilePicture} 
        followers={user.followers}
        following={user.following}
      />
      <main className="main-content">
        <section className="profile-section">
          <div className="profile-pic">
            <img 
              src={user.profile?.profilePicture} 
              style={{ width: "100%", height: "100%", objectFit: 'cover' }} 
              alt="Profile"
            />
          </div>
          <h1>{username}</h1>
          <p>{user.profile.bio}</p>
        </section>
        {/* Posts component handles all post functionality */}
        <Posts
          username={username}
          userProfilePicture={user.profile?.profilePicture}
        />
      </main>
    </div>
  ) : (
    <p style={{ color: 'white' }}>Loading...</p>
  );
};

export default ProfilePage;