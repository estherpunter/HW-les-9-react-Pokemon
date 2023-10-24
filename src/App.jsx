import './App.css'
import axios from "axios";
import {useEffect, useState} from "react";
import Pokemon from "./components/pokemon/Pokemon.jsx";
import Button from "./components/button/Button.jsx";

function App() {
    const [pokemon, setPokemon] = useState([]);
    const [endpoint, setEndpoint] = useState('https://pokeapi.co/api/v2/pokemon/');
    const [loading, toggleLoading] = useState(false);
    const [error, toggleError] = useState(false)

    useEffect(() => {
        const controller = new AbortController();

        async function fetchData() {
            toggleLoading(true);
            toggleError(false);

            try {
                const {data} = await axios.get(endpoint, {
                    signal: controller.signal,
                });
                setPokemon(data);
            } catch (e) {
                if (axios.isCancel(e)) {
                    console.error('Request is cancelled...');
                } else {
                    console.error(e);
                    toggleError(true);
                }
            } finally {
                toggleLoading(false);
            }
        }

        void fetchData();

        return function cleanup() {
            controller.abort();
        }
    }, [endpoint]);

    return (
        <div className='poke-deck'>
            {pokemon &&
                <>
                    <img src='src/assets/logo.png' alt="logo" width="400px"/>
                    <section className="button-bar">
                        <Button
                            disabled={!pokemon.previous}
                            clickHandler={() => setEndpoint(pokemon.previous)}
                            >
                            Vorige
                        </Button>
                        <Button
                            disabled={!pokemon.next}
                            clickHandler={() => setEndpoint(pokemon.next)}
                        >
                            Volgende
                        </Button>
                    </section>

                    <Pokemon endpoint="https://pokeapi.co/api/v2/pokemon/ditto"/>

                    {pokemon.results && pokemon.results.map((pokemon) => {
                        return <Pokemon key={pokemon.name} endpoint={pokemon.url}/>
                    })}
                </>
            }
            {loading && <p>Loading...</p>}
            {pokemon.length === 0 && error && <p>Er is iets misgegaan met het ophalen van de data</p>}
        </div>
    )
}

export default App
