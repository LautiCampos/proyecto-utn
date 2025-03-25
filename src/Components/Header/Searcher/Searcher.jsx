import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Searcher({ sendSearch }) {
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [allPokemon, setAllPokemon] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedPokemon = localStorage.getItem("allPokemon");
        if (storedPokemon) {
            setAllPokemon(JSON.parse(storedPokemon));
        } else {
            fetchAllPokemon();
        }
    }, []);

    const fetchAllPokemon = async () => {
        try {
            const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
            const data = await response.json();
            const pokemonList = data.results.map((pkmn, index) => ({
                name: pkmn.name,
                id: index + 1
            }));

            setAllPokemon(pokemonList);
            localStorage.setItem("allPokemon", JSON.stringify(pokemonList));
        } catch (error) {
            console.error("Error al obtener Pokémon:", error);
        }
    };

    const handleChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearch(query);

        if (query.length > 0) {
            const filtered = allPokemon.filter(pkmn =>
                pkmn.name.startsWith(query) || pkmn.id.toString().startsWith(query)
            );
            setSuggestions(filtered.slice(0, 10));
        } else {
            setSuggestions([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const query = search.trim().toLowerCase();
        const foundPokemon = allPokemon.find(pkmn => pkmn.name === query || pkmn.id.toString() === query);

        if (foundPokemon) {
            sendSearch(foundPokemon.name);
            setTimeout(() => setSearch(""), 100);  // Limpia el input después de la navegación
        } else {
            navigate('/not-found');
        }
        setSuggestions([]);
    };

    const handleSelect = (pkmn) => {
        sendSearch(pkmn.name);
        setTimeout(() => setSearch(""), 100);  // Limpia el input después de la selección
        setSuggestions([]);
    };

    return (
        <div className="search-container">
            <form className="form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="input"
                    placeholder="Buscar por nombre o ID"
                    value={search}
                    onChange={handleChange}
                />
            </form>
            {suggestions.length > 0 && (
                <ul className="suggestions">
                    {suggestions.map((pkmn) => (
                        <li key={pkmn.id} onClick={() => handleSelect(pkmn)}>
                            {pkmn.id} - {pkmn.name.charAt(0).toUpperCase() + pkmn.name.slice(1)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
