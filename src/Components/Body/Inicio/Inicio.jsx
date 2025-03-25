import React from "react";
import { Link } from "react-router-dom";
import { ColorMode } from "../../Header/ColorMode/ColorMode";
import '../../../Libreria/libreria.css'
import '../../Header/ColorMode/ColorMode.css'
import "./Inicio.css";

export function Inicio() {
    return (
        <div className="inicio-container">
            <ColorMode/>
            <h1 className="inicio-title">Bienvenido a la Pokédex</h1>
            <p className="inicio-description">
                Explora información sobre tus Pokémon favoritos, descubre sus habilidades y mucho más.
            </p>
            <Link to="/ListPokemon">
                <button className="inicio-button">Explorar Pokémon</button>
            </Link>
        </div>
    );
}
