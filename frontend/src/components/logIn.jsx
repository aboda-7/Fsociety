import axios from "axios";
import googleLogo from "../images/google.png";
import "./logIn.css";
import { useState } from "react";


const LogIn = () => {

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

    try {
      const response = await axios.post('http://localhost:4000/users/signIn', formData);
      setMessage(response.data.data.message);
      setError('');
    } catch (err) {
      setError(err.response.data.data.message);
      setMessage('');
    }
  };

  return (
    <div className="container">
      {message && <div style={{ color: 'green' }}>{message}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className="loginBox">
        <h2>Log In</h2>
        <div className="inputGroup">
          <input type="text" placeholder="Username or Email" value={formData.input} onChange={handleInputChange} name="input" required/>
        </div>
        <div className="inputGroup">
          <input type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} name="password" required/>
        </div>
        <button className="loginBtn" onClick={handleSubmit}>Log In</button>
        <div className="loginText">or login with</div>
        <div className="googleBtn">
          <img src={googleLogo} alt="Google Logo" />
        </div>
        <p className="signupText">
          Don't have an account? <span className="signupLink">Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
