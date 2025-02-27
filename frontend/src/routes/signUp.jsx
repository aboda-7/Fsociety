import axios from "axios";
import "./signUp.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react'
import googleLogo from "../images/google.png";


const SignUp = () => {

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/');
  };

  const handleSignUpClick = () => {
    navigate('/profile')
  };

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
      navigate('/');
      setMessage(response.data.data.message);
      setError('');
    } catch (err) {
      const errorMessage = err.response.data.data.message || "Something went wrong";
      setError(errorMessage);
      setMessage('');
    }
  };

  return (
    <div className="container">
      <div className="signUp">
        <h2>Sign Up</h2>
        {(error && !message) && <div style={{ color: 'red', marginBottom: '30px'}}>{error}</div>}
        {(message && !error) && <div style={{ color: 'green', marginBottom: '30px'}}>{message}</div>}
        <div className="inputRow">
          <div className="inputGroup">
            <input type="text" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} name="firstName" required/>
          </div>
          <div className="inputGroup">
            <input type="text" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} name="lastName" required/>
          </div>
        </div>
        <div className="inputRow">
          <div className="inputGroup">
            <input type="text" placeholder="Username" value={formData.userName} onChange={handleInputChange} name="userName" required/>
          </div>
          <div className="inputGroup">
            <input type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} name="email" required/>
          </div>
        </div>
        <div className="inputGroup">
          <input type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} name="password" required/>
        </div>
        <button className="signUpBtn" onClick={handleSubmit}>Sign Up</button>
        <div className="loginText">or login with</div>
        <div className="googleBtn" onClick={handleSignUpClick}>
          <img src={googleLogo} alt="Google Logo" />
        </div>
        <p className="signupText">
          Already have an account? <span className="loginLink" onClick={handleLoginClick}>Log In</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
