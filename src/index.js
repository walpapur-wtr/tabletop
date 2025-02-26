import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home-page.jsx";
import AuthPage from "./Login/LoginSignup-page.jsx";
import CharacterPage from "./Character/CharacterSheet/CharacterSheet-page.jsx";
import App from './App';
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/characters/:name" element={<CharacterSheet />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
