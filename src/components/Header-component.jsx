// Навігаційна панель
import React, { useState } from "react";
import { FaHome, FaUser } from "react-icons/fa"; // Імпорт іконок
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
          <a href="http://127.1.3.202:3000" className="nav-link">
            <FaHome className="icon" />
            <span className="nav-text">Home</span>
          </a>
          <a href="#profile" className="nav-link">
            <FaUser className="icon" />
            <span className="nav-text">User Profile</span>
          </a>
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
