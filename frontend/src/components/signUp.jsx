import axios from "axios";
import googleLogo from "../images/google.png";
import "./signUp.css";
import { useState } from "react";


const SignUp = () => {

  const [formData, setFormData] = useState({
    firstName : '',
    lastName : '',
    userName: '',
    email : '',
    password: ''
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
      const response = await axios.post('http://localhost:4000/users/signUp', formData);
      setMessage(response.data.data.message);
    } catch (err) {
      const errorMessage = err.response.data.data.message || "Something went wrong";
      setError(errorMessage);
    }
  };

  return (
    <div className="container">
      {message && <div style={{ color: 'green' }}>{message}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className="loginBox">
        <h2>Sign Up</h2>
        <div className="inputGroup">
          <input type="text" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} name="firstName" required/>
        </div>
        <div className="inputGroup">
          <input type="text" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} name="lastName" required/>
        </div>
        <div className="inputGroup">
          <input type="text" placeholder="Username" value={formData.userName} onChange={handleInputChange} name="userName" required/>
        </div>
        <div className="inputGroup">
          <input type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} name="email" required/>
        </div>
        <div className="inputGroup">
          <input type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} name="password" required/>
        </div>
        <button className="loginBtn" onClick={handleSubmit}>Sign Up</button>
        {/* <div className="loginText">or login with</div>
        <div className="googleBtn">
          <img src={googleLogo} alt="Google Logo" />
        </div>
        <p className="signupText">
          Don't have an account? <span className="signupLink">Sign Up</span>
        </p> */}
      </div>
    </div>
  );
};

export default SignUp;
