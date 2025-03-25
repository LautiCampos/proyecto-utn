import { Routes, Route, useNavigate } from 'react-router-dom';

import { Inicio } from './Components/Body/Inicio/Inicio';
import { NotFound } from './Components/Body/NotFound/NotFound';
import { ListPokemon } from './Components/Body/ListPokemon/ListPokemon';
import { Pokemon } from './Components/Body/Pokemon/Pokemon';
import { Recommended } from './Components/Header/Recommended/Recommended';



function App() {
    

    const navigate = useNavigate();

    const handleSearch = (pokemonName) => {
        navigate(`/pokemon/${pokemonName}`);
    };

    return (

        <>
         <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/ListPokemon" element={<ListPokemon sendSearch={handleSearch} />} />
                <Route path="/pokemon/:id" element={<Pokemon sendSearch={handleSearch} />} />
                <Route path="/recommended" element={<Recommended />} /> 
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>


    );
}


export default App;