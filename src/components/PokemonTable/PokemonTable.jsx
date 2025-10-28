import React from "react";
import PokemonType from "../PokemonType/PokemonType";
import style from "./PokemonTable.module.css";
import {getPokemonImage, pokemonDefaultImage} from "../../utility/utility";
import {NavLink} from "react-router-dom";

function PokemonTable(props) {
    const {pokemonList} = props;

    const pokemonTr = pokemonList.map((pokemon) => {

        const types = pokemon.type.map((type) => <PokemonType key={`${pokemon.id}-${type}`} typeName={type}/>);


        return (
            <tr key={pokemon.id}>
                <td>{pokemon.id}</td>
                <td className={style.pokemonImage}>
                    <img onError={(event) => pokemonDefaultImage(event)} src={getPokemonImage(pokemon.id)}
                         alt={pokemon.name.english}
                         loading="lazy"
                    />
                </td>
                <td>{pokemon.name.english}</td>
                <td>{types}</td>
                <td><NavLink className={style.action} to={`/pokedex/${pokemon.id}`}>Scheda</NavLink></td>
            </tr>
        )
    });

    return (
        <table className={`table ${style.table}`}>
            <thead>
            <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Type</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {pokemonTr}
            </tbody>
        </table>
    )
}

export default PokemonTable;


