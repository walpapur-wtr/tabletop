import React, { useState } from 'react';
import LoginForm from './LoginForm.jsx';
import RegisterForm from './RegisterForm.jsx';
import HeaderComponent from '../components/Header-component.jsx';
import FooterComponent from '../components/Footer-component.jsx';
import DiceRollerButton from "../components/DiceRollerButton.jsx";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = (username) => {
    localStorage.setItem("username", username); // Save username in localStorage
    navigate("/"); // Redirect to the homepage
  };

  const toggleForm = () => {
    setIsRegistering((prev) => !prev);
  };

  return (
    <div className="login-container">
      <HeaderComponent className="header" />
      {isRegistering ? (
        <RegisterForm toggleForm={toggleForm} />
      ) : (
        <LoginForm toggleForm={toggleForm} onLoginSuccess={handleLoginSuccess} />
      )}
      <DiceRollerButton />
      <FooterComponent className="footer" />
    </div>
  );
};

export default LoginPage;
