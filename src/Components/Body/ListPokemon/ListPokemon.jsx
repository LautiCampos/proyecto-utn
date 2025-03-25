import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowUp } from "react-icons/fa";
import { Header } from '../../Header/Header';
import '../../Header/ColorMode/ColorMode.css';
import './ListPokemon.css';

export function ListPokemon({sendSearch}) {
    const [data, setData] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const observerTarget = useRef(null);
    const API_URL = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`;

    const typeColors = {
        normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
        grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
        ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
        rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
        steel: "#B7B7CE", fairy: "#D685AD", unknown: "#888888"
    };

    const fetchPokemon = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const prev = await response.json();
            const newPokemon = await Promise.all(prev.results.map(async (pkmon) => {
                try {
                    const res = await fetch(pkmon.url);
                    if (!res.ok) throw new Error(`Error en ${pkmon.name}`);

                    const details = await res.json();
                    return { 
                        id: details.id || 0,
                        name: details.name || "Desconocido",
                        types: details.types?.map(t => t.type.name) || ["unknown"],
                        image: details.sprites?.front_default || "https://via.placeholder.com/96"
                    };
                } catch (err) {
                    console.error("Error obteniendo detalles:", err);
                    return null;
                }
            }));

            setData(prevData => [...prevData, ...newPokemon.filter(p => p !== null)]);
            setOffset(prevOffset => prevOffset + 20);
        } catch (error) {
            console.error("Error al obtener Pokémon:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPokemon();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchPokemon();
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [data]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    
    return (
        <>
             <Header sendSearch={sendSearch} />
            <section className="list-container">
                {data.length > 0 &&
                    data.map((pkmon, index) => {
                        if (!pkmon || !pkmon.id) return null;

                        let idStr = pkmon.id.toString().padStart(3, '0');

                        return (
                            <Link
                                key={pkmon.name}
                                to={`/pokemon/${pkmon.id}`}
                                ref={index === data.length - 1 ? observerTarget : null}
                                className="pokemon-card"
                            >
                                <img className="pokemon-img1" src={pkmon.image} alt={pkmon.name} loading="lazy" />
                                <p className="pokemon-id">#{idStr}</p>
                                <h2 className="pokemon-name">{pkmon.name}</h2>
                                <p className="pokemon-type">
                                    {pkmon.types.map((type, i) => (
                                        <span 
                                            key={type} 
                                            style={{ color: typeColors[type.toLowerCase()] || typeColors["unknown"], fontWeight: "bold" }}
                                        >
                                            {type}{i < pkmon.types.length - 1 ? "  " : ""}
                                        </span>
                                    ))}
                                </p>
                            </Link>
                        );
                    })
                }
            </section>
            {loading && <p className="loading-text">Cargando más Pokémon...</p>}

            {showScrollTop && (
                <button className="scroll-top-btn" onClick={scrollToTop}>
                    <FaArrowUp />
                </button>
            )}
        </>
    );
}



