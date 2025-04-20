// Навігаційна панель
import React, { useState } from "react";
import { FaHome, FaUser } from "react-icons/fa"; // Імпорт іконок
import { Link } from "react-router-dom";
import "../styles/HeadFooter.css";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Випадаюче меню

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <header className="header">
      <nav className="header__nav">
        <div className="header__nav-left">
          <Link to="/" className="header__nav-link">
            <FaHome className="header__icon" />
            <span className="header__nav-text">Home</span>
          </Link>
          <Link to="/my-profile" className="header__nav-link">
            <FaUser className="header__icon" />
            <span className="header__nav-text">User Profile</span>
          </Link>
        </div>
        <div className="header__nav-right">
          <div className="header__nav-item">
            <button className="header__nav-link header__dropdown-toggle" onClick={toggleDropdown}>
              Coming Soon
            </button>
            {isDropdownOpen && (
              <div className="header__dropdown">
                <a href="#spells" className="header__dropdown-link">Заклинання</a>
                <a href="#monsters" className="header__dropdown-link">Монстри</a>
                <a href="#campaigns" className="header__dropdown-link">Кампанії</a>
                <a href="#dice-roller" className="header__dropdown-link">Кидки кубиків</a>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
