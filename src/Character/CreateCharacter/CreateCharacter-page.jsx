import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DnDForm from "../CreateCharacter/DnDForm-component";
import CustomForm from "../CreateCharacter/CustomForm-component";
import HeaderComponent from "../../components/Header-component.jsx";
import FooterComponent from "../../components/Footer-component.jsx";

const CreateCharacterPage = () => {
  const { system } = useParams();
  const [searchParams] = useSearchParams();
  const [sections, setSections] = useState([]); // Initialize as an empty array
  const [formComponent, setFormComponent] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const component = searchParams.get("component");
    console.log("Component parameter from URL:", component);
    if (component === "DnDForm" || component === "CustomForm") {
      setFormComponent(component === "DnDForm" ? DnDForm : CustomForm);
      console.log("Form component set to:", component);
    } else {
      setError("Невідомий компонент форми.");
      setLoading(false);
      console.error("Unknown form component:", component);
    }
  }, [searchParams]);

  useEffect(() => {
    const systemName = system.replace(".json", ""); // Remove .json if present
    console.log("System name extracted from URL:", systemName);
    fetch(`/configs/${systemName}.json`)
      .then((res) => {
        console.log("Fetching configuration file:", `/configs/${systemName}.json`);
        if (!res.ok) {
          throw new Error("Configuration file not found");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Configuration file loaded successfully:", data);
        if (data.sections && Array.isArray(data.sections)) {
          setSections(data.sections);
          console.log("Sections set successfully:", data.sections);
        } else {
          console.error("Invalid or missing 'sections' in configuration file:", data);
          setError("Невірний формат конфігураційного файлу.");
        }
        setLoading(false); // Set loading to false when data is loaded
      })
      .catch((err) => {
        console.error("Error loading config:", err);
        setSections([]); // Set empty array in case of error
        setError("Не вдалося завантажити конфігурацію.");
        setLoading(false); // Set loading to false on error
      });
  }, [system]);

  if (loading) {
    console.log("Page is loading...");
    return <p>Завантаження...</p>;
  }

  if (error) {
    console.error("Error encountered:", error);
    return <p className="error">{error}</p>;
  }

  if (!formComponent) {
    console.error("Form component is not defined.");
    return <p>Дані відсутні.</p>;
  }

  if (!sections || sections.length === 0) {
    console.error("Sections are invalid or empty:", sections);
    return <p>Немає доступних секцій для цієї системи.</p>;
  }

  console.log("Passing sections to form component:", sections);
  const FormComponent = formComponent;

  return (
    <div className="create-character-page">
      <HeaderComponent />
      <FormComponent sections={sections} />
      <FooterComponent />
    </div>
  );
};

export default CreateCharacterPage;
