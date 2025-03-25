import { Link } from "react-router-dom";
import '../../Header/ColorMode/ColorMode.css'
import '../../../Libreria/libreria.css'
import "./NotFound.css";

export function NotFound() {
    return (
        <div className="not-found-container">
            <h2>¡No se encontraron resultados!</h2>
            <p>Intenta buscar otro Pokémon o revisa la ortografía.</p>
            <Link to="/ListPokemon" className="back-home">Volver al inicio</Link>
        </div>
    );
}
