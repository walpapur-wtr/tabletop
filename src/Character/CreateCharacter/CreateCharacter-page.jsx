import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DnDForm from "./DnDForm-component";
import PathfinderForm from "./PathFinderForm-component";
import CallOfCthulhuForm from "./CustomForm-component";
import SystemModal from "./SystemModal-component";
import HeaderComponent from "../../components/Header-component";
import FooterComponent from "../../components/Footer-component.jsx";
import DiceRollerButton from "../../components/DiceRollerButton.jsx";
import ModalMessage from "../../components/ModalMessage";
import "./CreateCharacter-styles.css";

const CreateCharacterPage = () => {
  const { system, version } = useParams();
  const navigate = useNavigate();
  const [formComponent, setFormComponent] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSystemModal, setShowSystemModal] = useState(!system);

  const handleSystemSelect = (selectedSystem, selectedVersion) => {
    setShowSystemModal(false);
    navigate(`/create-character/${selectedSystem}/${selectedVersion}`);
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        console.log("Fetching configuration for:", system, version);
        const response = await fetch(`/api/systems/${system}/${version}`);
        if (!response.ok) throw new Error("Не вдалося завантажити конфігурацію.");
        const data = await response.json();
        console.log("Configuration data received:", data);
        setConfig({ ...data, system, version }); // Додаємо system і version до конфігурації

        if (system === "dnd") {
          setFormComponent(() => DnDForm);
        } else if (system === "pathfinder") {
          setFormComponent(() => PathfinderForm);
        } else if (system === "call-of-cthulhu") {
          setFormComponent(() => CallOfCthulhuForm);
        } else {
          throw new Error("Невідома система.");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching configuration:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchConfig();
  }, [system, version]);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!formComponent) return <p>Компонент форми не знайдено.</p>;

  const FormComponent = formComponent;
  return (
    <div className="create-character-page">
      <HeaderComponent />
      {showLoginModal && (
        <ModalMessage
          message="Будь ласка, увійдіть щоб створити персонажа"
          onClose={() => setShowLoginModal(false)}
          onConfirm={redirectToLogin}
        />
      )}
      {showSystemModal ? (
        <SystemModal
          onClose={() => navigate("/")}
          onSystemSelect={handleSystemSelect}
        />
      ) : (
        FormComponent && <FormComponent config={config} />
      )}
      <DiceRollerButton />
      <FooterComponent />
    </div>
  );
};

export default CreateCharacterPage;
