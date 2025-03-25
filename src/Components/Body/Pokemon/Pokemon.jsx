import { useState, useEffect } from 'react'; 
import { Link, useParams } from 'react-router-dom';
import { Header } from '../../Header/Header';
import { FaArrowLeft } from "react-icons/fa";
import '../../../Libreria/libreria.css'
import '../../Header/ColorMode/ColorMode.css'
import './Pokemon.css';

export function Pokemon({ sendSearch }) {
    let { id } = useParams();
    const [data, setData] = useState({});
    const [idString, setIdString] = useState("");
    const [weaknesses, setWeaknesses] = useState([]);
    const [evolutions, setEvolutions] = useState([]);
    
    const typeColors = {
        normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
        grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
        ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
        rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
        steel: "#B7B7CE", fairy: "#D685AD", unknown: "#888888"
    };

    const API_URL = `https://pokeapi.co/api/v2/pokemon/${id}`;

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                let response = await fetch(API_URL);
                let previousData = await response.json();
                setData(previousData);
                setIdString(previousData.id.toString());
                fetchWeaknesses(previousData.types);
                fetchEvolutionChain(previousData.species.url);
            } catch (error) {
                console.error("Error al obtener datos del Pokémon:", error);
            }
        };

        fetchPokemon();
    }, [id]);

    const fetchWeaknesses = async (types) => {
        let allWeaknesses = new Set();
        for (let type of types) {
            let typeResponse = await fetch(type.type.url);
            let typeData = await typeResponse.json();
            typeData.damage_relations.double_damage_from.forEach(weak => 
                allWeaknesses.add(weak.name)
            );
        }
        setWeaknesses([...allWeaknesses]);
    };

    const fetchEvolutionChain = async (speciesUrl) => {
        let speciesResponse = await fetch(speciesUrl);
        let speciesData = await speciesResponse.json();
        let evolutionChainUrl = speciesData.evolution_chain.url;

        let evolutionResponse = await fetch(evolutionChainUrl);
        let evolutionData = await evolutionResponse.json();

        let evolutionsList = [];
        let currentEvolution = evolutionData.chain;

        while (currentEvolution) {
            let pokemonName = currentEvolution.species.name;
            let pokemonId = speciesUrlToId(currentEvolution.species.url);
            evolutionsList.push({ name: pokemonName, id: pokemonId });
            
            currentEvolution = currentEvolution.evolves_to[0];
        }

        setEvolutions(evolutionsList);
    };

    const speciesUrlToId = (url) => {
        return url.split("/").filter(part => part).pop();
    };

    let img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idString}.png`;

    return (
        <>
            {Object.keys(data).length > 0 &&
                <>
                    <Header sendSearch={sendSearch} />
                    <Link to="/">← Volver al inicio</Link>
                    <div className='back'>
                        <div className="item">
                            <Link className='arrow-left' to='/ListPokemon'><FaArrowLeft/></Link>
                            <h2 className='title-poke'>{data.name.toUpperCase()} <span className="pokemon-id">N.° {idString.padStart(4, '0')}</span></h2>
                            <div className="grid-2-complete">
                                <img className="pokemon-img" src={img} alt={data.name} />
                                <div className="right-content">
                                    <h3>Habilidades</h3>
                                    <div className="grid-2">
                                        {data.abilities.map((ability, index) => (
                                            <p key={index}>{ability.ability.name}</p>
                                        ))}
                                    </div>

                                    <h3>Tipos</h3>
                                    <div className="pokemon-grid">
                                        {data.types.map((type, index) => (
                                            <p key={index} style={{ color: typeColors[type.type.name] || typeColors["unknown"], fontWeight: "bold" }}>
                                                {type.type.name}
                                            </p>
                                        ))}
                                    </div>

                                    <h3>Debilidades</h3>
                                    <div className="pokemon-grid">
                                        {weaknesses.map((weak, index) => (
                                            <p key={index} style={{ color: typeColors[weak] || typeColors["unknown"], fontWeight: "bold" }}>
                                                {weak}
                                            </p>
                                        ))}
                                    </div>

                                    <h3>Estadísticas Base</h3>
                                    <div className="grid-2">
                                        {data.stats.map((stat, index) => (
                                            <p key={index}><strong>
                                                {stat.stat.name === "hp" ? "PS" :
                                                stat.stat.name === "attack" ? "Ataque" :
                                                stat.stat.name === "defense" ? "Defensa" :
                                                stat.stat.name === "special-attack" ? "Ataque Especial" :
                                                stat.stat.name === "special-defense" ? "Defensa Especial" :
                                                stat.stat.name === "speed" ? "Velocidad" :
                                                capitalizeFirstLetter(stat.stat.name)}
                                            :</strong> {stat.base_stat}</p>
                                        ))}
                                    </div>
                                    
                                    <h3>Evoluciones</h3>
                                    <div className="evolution-container">
                                        {evolutions.map((evo, index) => (
                                            <div key={index} className="evolution-card">
                                                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`} alt={evo.name} />
                                                <p>{evo.name} N.° {evo.id}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    );
}
