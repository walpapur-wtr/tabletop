//Home-page.jsx
import HeaderComponent from "../components/Header-component";
import FooterComponent from "../components/Footer-component.jsx";
import CharacterGrid from "../Character/CharacterGrid-component.jsx";
import DiceRollerButton from "../components/DiceRollerButton.jsx";
import "../styles/Home-styles.css";

const HomePage = () => {
  return (
    <div className="home-page">
      <HeaderComponent />
      <div className="home-page__content">
        <CharacterGrid />
      </div>
      <DiceRollerButton />
      <FooterComponent />
    </div>
  );
};

export default HomePage;
