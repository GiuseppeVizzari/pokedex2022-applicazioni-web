import React from "react";
import PokemonCard from "../PokemonCard/PokemonCard";
import {getPokemonImage} from "../../utility/utility";

function PokemonCardsGrid(props) {
    const {pokemonList, col} = props;

    const pokemonCardsCol = pokemonList.map((pokemon) => {
        return (
            <div key={pokemon.id} className="col">
                <PokemonCard
                name={pokemon.name.english}
                number={pokemon.id}
                image={getPokemonImage(pokemon.id)}
                types={pokemon.type}
                />
            </div>
        )
    });

    return (
        <div className={`row 
                row-cols-${col.xs}
                row-cols-sm-${col.sm}
                row-cols-md-${col.md}
                row-cols-lg-${col.lg}
                row-cols-xl-${col.xl}
        `}>
            {pokemonCardsCol}
        </div>
    )
}

export default PokemonCardsGrid;




