import { Link } from 'react-router-dom';
import { Searcher } from './Searcher/Searcher';
import { ColorMode } from './ColorMode/ColorMode';
import { Recommended } from './Recommended/Recommended';
import '../../Libreria/libreria.css'
import './Searcher/Searcher.css'
import './ColorMode/ColorMode.css'
import './Header.css';

export function Header({ sendSearch }) {
    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo">PokeDex</Link>

                {/* Buscador */}
                <Searcher sendSearch={sendSearch} />

                {/* Botón de cambio de modo */}
                <ColorMode />
            </div>
        </header>
    );
}