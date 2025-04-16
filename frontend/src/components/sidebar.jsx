import { useNavigate } from "react-router-dom";
import "./sidebar.css";
import axios from "axios";

const Sidebar = ({ userProfilePicture, followers, following }) => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.get(`http://localhost:4000/profile/logOut`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (error) {
      console.log(`Couldn't sign Out" ${error}`);
    }
  };

  const handleHome = () => {
    navigate('/home');
  };

  return (
    <aside className="sidebar">
      <div className="profile-pic">
        <img 
          src={userProfilePicture} 
          style={{ width: "100%", height: "100%", objectFit: 'cover' }} 
          alt="Profile"
        />
      </div>
      <nav>
        <a onClick={handleHome}>Home</a>
        <a href="#">Profile Page</a>
        <a href="#">Settings</a>
        <a onClick={handleLogOut}>Logout</a>
      </nav>
      <p>Followers: {followers}</p>
      <p>Following: {following}</p>
      {/* Sidebar New Post Button */}
      <button 
        onClick={() => document.querySelector('.new-post-button').click()} 
        className="new-post-button"
      >
        + New Post
      </button>
    </aside>
  );
};

export default Sidebar;