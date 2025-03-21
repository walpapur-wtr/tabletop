// Навігаційна панель
import React, { useState } from "react";
import { FaHome, FaUser } from "react-icons/fa"; // Імпорт іконок
import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Випадаюче меню

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <Link to="/" className="nav-link">
            <FaHome className="icon" />
            <span className="nav-text">Home</span>
          </Link>
          <Link to="/login" className="nav-link">
            <FaUser className="icon" />
            <span className="nav-text">User Profile</span>
          </Link>
            
        </div>
        <div className="nav-right">
          <div className="nav-item">
            <button className="nav-link dropdown-toggle" onClick={toggleDropdown}>
              Coming Soon
            </button>
            {isDropdownOpen && (
              <div className="dropdown">
                <a href="#spells" className="dropdown-link">Заклинання</a>
                <a href="#monsters" className="dropdown-link">Монстри</a>
                <a href="#campaigns" className="dropdown-link">Кампанії</a>
                <a href="#dice-roller" className="dropdown-link">Кидки кубиків</a>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
