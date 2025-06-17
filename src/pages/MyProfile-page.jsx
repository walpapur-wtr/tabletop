import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/Header-component";
import FooterComponent from "../components/Footer-component";
import UserProfile from "../components/UserProfile-component";
import "../styles/Home-styles.css";

const MyProfilePage = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="home-page">
      <HeaderComponent />
      <div className="home-page__content profile-content">
        <UserProfile onLogout={handleLogout} />
      </div>
      <FooterComponent />
    </div>
  );
};

export default MyProfilePage;
