import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home-page.jsx";
import CharacterSheet from "./Character/CharacterSheet-component.jsx";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/characters/:name" element={<CharacterSheet />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
