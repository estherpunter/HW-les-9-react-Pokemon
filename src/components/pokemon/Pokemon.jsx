import {useEffect, useState} from "react";
import axios from "axios";
import './Pokemon.css';

function Pokemon({endpoint}) {
    const [pokemon, setPokemon] = useState({});
    const [loading, toggleLoading] = useState(false);
    const [error, toggleError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchData() {
            toggleLoading(true);
            toggleError(true);

            try {
                const {data} = await axios.get(endpoint, {
                    signal: controller.signal,
                });
                setPokemon(data)
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

        if (endpoint) {
            void fetchData();
        }

        return () => {
            console.log('unmount effect is triggered');
            controller.abort();
        }

    }, []);


    return (
        <article className="poke-card">
            {console.log('Rerender is triggered')}
            {Object.keys(pokemon).length > 0 &&
                <>
                    <h2>{pokemon.name}</h2>
                    <img
                        src={pokemon.sprites.front_default}
                        alt="Afbeelding pokémon"
                    />
                    <p>Moves: {pokemon.moves.length}</p>
                    <p>Weight: {pokemon.weight}</p>
                    <p>Abilities:</p>
                    <ul>
                        {pokemon.abilities.map((ability) => {
                            return (
                                <li key={`${ability.ability.name}-${pokemon.name}`}>
                                    {ability.ability.name}
                                </li>
                            )
                        })}
                    </ul>
                </>
            }
            {loading && <p>Loading...</p>}
            {Object.keys(pokemon).length === 0 && error && <p>Er is iets misgegaan bij het ophalen van deze Pokemon...</p>}
        </article>
    )
}


export default Pokemon;