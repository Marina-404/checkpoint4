import { useNavigate } from "react-router-dom";
import listieCat from "../assets/listie-cat.png";
import "../style/landingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <img
        className="landing-img"
        src={listieCat}
        alt="Listie le chat"
      />
      <h1 className="landing-title">Bienvenue sur</h1>
      <h1 className="landing-Listie">Listie !</h1>
      <p className="landing-description">Votre compagnon pour organiser toutes vos tâches</p>
      <button
        className="landing-btn"
        onClick={() => navigate("/lists")}
        >
        Voir mes listes
      </button>
    </div>
  );
}
