import React from "react";
import PokemonCardsGrid from "../../components/PokemonCardsGrid/PokemonCardsGrid";
import PokemonListData from "../../assets/data/pokedex";
import {NavLink} from "react-router-dom";


function Home() {
    const pokemonFiltered = PokemonListData.filter((pokemon) => pokemon.id === 1 || pokemon.id === 4 || pokemon.id === 7);
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col">

                    <div className="my-5 text-center">

                        <PokemonCardsGrid
                            pokemonList={pokemonFiltered}
                            col={{xs: 1, sm: 1, md: 3, lg: 3, xl: 3}}
                        />
                        <NavLink className="button" to="/pokedex">Gotta Catch 'em all</NavLink>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Home;



