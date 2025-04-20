import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/Home-page.jsx";
import CharacterPage from "./Character/CharacterSheet/CharacterSheet-page.jsx";
import CreateCharacterPage from "./Character/CreateCharacter/CreateCharacter-page.jsx";
import Login from './Login/LoginPage';
import MyProfilePage from "./pages/MyProfile-page.jsx";

import "./styles/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/characters/:name" element={<CharacterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-character/:system/:version" element={<CreateCharacterPage />} />
        <Route path="/my-profile" element={<MyProfilePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
