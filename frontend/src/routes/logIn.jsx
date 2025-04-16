import axios from "axios";
import googleLogo from "../images/google.png";
import "./logIn.css";
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const LogIn = () => {

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/signup');
  };

  const [formData, setFormData] = useState({
    input : '',
    password : ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target; 
    setFormData({ ...formData, [name]: value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    try {
      const response = await axios.post(`http://localhost:4000/users/signIn`, formData);
      
      const token  = response.data.data.token;
      localStorage.setItem("token", token);


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
        
        const userNameResponse = await axios.get(`http://localhost:4000/users/getUserById/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const username = userNameResponse.data.data.username
        localStorage.setItem("username", username);
  
      window.location.href = `/profile/${username}`;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };
  


  return (
    <div className="container">
      <div className="loginBox">
        <h2>Log In</h2>
        {(error && !message) && <div style={{ color: 'red', marginBottom: '30px'}}>{error}</div>}
        {(message && !error) && <div style={{ color: 'green', marginBottom: '30px'}}>{message}</div>}
        <div className="inputLogin">
          <input type="text" placeholder="Username or Email" value={formData.input} onChange={handleInputChange} name="input" required/>
        </div>
        <div className="inputLogin">
          <input type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} name="password" required/>
        </div>
        <button className="loginBtn" onClick={handleSubmit}>Log In</button>
        <div className="loginText">or login with</div>
        <div className="googleBtn">
          <img src={googleLogo} alt="Google Logo" />
        </div>
        <p className="signupText">
          Don't have an account? <span className="signupLink" onClick={handleLoginClick}>Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
