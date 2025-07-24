import { useNavigate } from "react-router-dom";
import listieCat from "../assets/listie-cat.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div >
      <img
        src={listieCat}
        alt="Listie le chat"
      />
      <h1>Bienvenue sur <span>Listie</span> !</h1>
      <p >Votre compagnon pour organiser toutes vos tâches</p>
      <button
        onClick={() => navigate("/lists")}
        >
        Voir mes listes
      </button>
    </div>
  );
}
