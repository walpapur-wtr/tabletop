import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DnDForm from "./DnDForm-component";
import PathfinderForm from "./PathFinderForm-component";
import CallOfCthulhuForm from "./CustomForm-component";

const CreateCharacterPage = () => {
  const { system, version } = useParams();
  const [formComponent, setFormComponent] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchConfig = async () => {
    try {
      console.log("Fetching configuration for:", system, version);
      const response = await fetch(`/api/systems/${system}/${version}`);
      if (!response.ok) throw new Error("Не вдалося завантажити конфігурацію.");
      const data = await response.json();
      console.log("Configuration data received:", data);
      setConfig(data);

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
  return <FormComponent config={config} />;
};

export default CreateCharacterPage;