import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/Home-page.jsx";
import CharacterPage from "./Character/CharacterSheet/CharacterSheet-page.jsx";
import CreateCharacterPage from "./Character/CreateCharacter/CreateCharacter-page.jsx";
import Login from './Login/LoginPage';
import MyProfilePage from "./pages/MyProfile-page.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import "./styles/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/create-character" element={
          <ProtectedRoute>
            <CreateCharacterPage />
          </ProtectedRoute>
        } />
        <Route path="/create-character/:system/:version" element={
          <ProtectedRoute>
            <CreateCharacterPage />
          </ProtectedRoute>
        } />
        <Route path="/characters/:name" element={
          <ProtectedRoute>
            <CharacterPage />
          </ProtectedRoute>
        } />
        <Route path="/my-profile" element={
          <ProtectedRoute>
            <MyProfilePage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
