import { BrowserRouter, Routes, Route, Router, useLocation } from 'react-router-dom'; 
import SignUp from "./components/signUp.jsx";
import LogIn from "./components/logIn.jsx";
import { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';


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
    document.title="Fsociety"
  }, []);
  
  return (
      <Routes>
        <Route path="/" element={<LogIn />}></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
      </Routes>
  );
}

export default App;
