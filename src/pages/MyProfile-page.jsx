import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/Header-component";
import FooterComponent from "../components/Footer-component";
import DiceRollerButton from "../components/DiceRollerButton";
import CharacterCard from "../Character/CharacterCard-component";
import SystemModal from "../Character/CreateCharacter/SystemModal-component";
import "../styles/Home-styles.css";

const MyProfilePage = () => {
  const [characters, setCharacters] = useState([]);
  const [isSystemModalVisible, setIsSystemModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    fetch("/api/characters", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Include token in the header
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch characters");
        }
        return res.json();
      })
      .then((data) => {
        // Filter characters by the logged-in user's username
        const userCharacters = data.filter((character) => character.user === username);
        setCharacters(userCharacters);
      })
      .catch((err) => console.error("Error fetching characters:", err));
  }, [navigate]);

  const handleSystemSelect = (system, version) => {
    setIsSystemModalVisible(false);
    navigate(`/create-character/${system}/${version}`);
  };

  return (
    <div className="home-page">
      <HeaderComponent />
      <div className="home-page__content">
        <div className="character-grid">
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
          <CharacterCard onAddClick={() => setIsSystemModalVisible(true)} />
        </div>
      </div>
      {isSystemModalVisible && (
        <SystemModal
          onClose={() => setIsSystemModalVisible(false)}
          onSystemSelect={handleSystemSelect}
        />
      )}
      <DiceRollerButton />
      <FooterComponent />
    </div>
  );
};

export default MyProfilePage;
