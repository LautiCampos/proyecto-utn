import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../Header';
import '../../../Libreria/libreria.css'
import '../ColorMode/ColorMode.css'
import './Recommended.css';

export function Recommended() {
    const [recommended, setRecommended] = useState([]);

    useEffect(() => {
        fetchRandomPokemon();
    }, []);

    const fetchRandomPokemon = async () => {
        let randomIds = Array.from({ length: 10 }, () => Math.floor(Math.random() * 151) + 1); // Solo los primeros 151
        let promises = randomIds.map(id =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
        );

        let results = await Promise.all(promises);
        setRecommended(results);
    };


    return (
        <>
        <div className="recommended-container">
            <h2 className="recommended-title">Pokémon Recomendados</h2>
            <div className="recommended-list">
                {recommended.map(poke => (
                    <Link key={poke.id} to={`/pokemon/${poke.id}`} className="pokemon-card ">
                        <img className="pokemon-img1" src={poke.sprites.front_default} alt={poke.name} />
                        <p className="pokemon-name">{poke.name}</p>
                        <p className="pokemon-id">N.° {poke.id}</p>
                    </Link>
                ))}
            </div>
        </div>
        </>
    );
}
