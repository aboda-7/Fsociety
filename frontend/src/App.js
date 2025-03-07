import { BrowserRouter, Routes, Route, Router, useLocation } from 'react-router-dom'; 
import SignUp from "./routes/signUp.jsx";
import LogIn from "./routes/logIn.jsx";
import ProfilePage from './routes/profile.jsx';
import HomePage from './routes/homePage.jsx'
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Home } from 'lucide-react';


// Mesa mesa

function App() {

  const location = useLocation();
  const [animationClass, setAnimationClass] = useState('');
  
  useEffect(() => {
    if (location.pathname === '/login') {
      setAnimationClass('shrink');
    } else if (location.pathname === '/signup') {
      setAnimationClass('grow');
    }
  }, [location]);
  
  useEffect(() => {
    document.title="Fsocial"
  }, []);
  
  return (
    <Routes>
      <Route path="/" element={<LogIn />}></Route>
      <Route path="/signUp" element={<SignUp />}></Route>
      <Route path="/profile/:username" element={<PrivateRoute><ProfilePage /></PrivateRoute>}></Route>
      <Route path="/home" element={<HomePage />}></Route>
    </Routes>
  );
}

function PrivateRoute({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/" />;
}

export default App;
