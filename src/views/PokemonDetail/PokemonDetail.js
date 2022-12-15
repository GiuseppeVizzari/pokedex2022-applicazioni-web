import React, {useEffect, useState} from "react";
import PokemonListData from "../../assets/data/pokedex"
import {
    cleanText,
    getPokemonImage,
    pokemonDefaultImage,
    removeDashesAndUnderscores,
    zeroPad
} from "../../utility/utility";
import PokemonType from "../../components/PokemonType/PokemonType";
import {NavLink, useParams} from "react-router-dom";
import style from "./PokemonDetail.module.css";


function PokemonDetail() {

    let {number} = useParams();
    let id = parseInt(number);

    const currentPokemon = PokemonListData.filter((pokemon) => pokemon.id === id)[0];

    const [pokemonData, setPokemonData] = useState([]);
    const [pokemonSpeciesData, setPokemonSpeciesData] = useState([]);

    useEffect(() => {

        let isMounted = true;

        fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
            .then(res => res.json())
            .then(res => {

                if (isMounted)
                    setPokemonData(res);
            })
            .catch((error) => console.log("Error" + error));

        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                if (isMounted)
                    setPokemonSpeciesData(res);
            })
            .catch((error) => console.log("Error" + error));


        return () => {
            isMounted = false;
        }

    }, [id]);


    let sprites = [];
    if (pokemonData && pokemonData.sprites) {
        Object.keys(pokemonData.sprites).map((key) => {
            if (typeof pokemonData.sprites[key] === 'string')
                return sprites.push({src: pokemonData.sprites[key], name: key})
        });
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col">

                    <div className={style.navigation}>

                        {id - 1 !== 0 &&
                        <NavLink className={`${style.prev} ${style.navItem}`}
                                 to={`/pokedex/${id - 1}`}>&lt; Prev</NavLink>
                        }

                        {id + 1 <= Object.keys(PokemonListData).length &&
                        <NavLink className={`${style.next} ${style.navItem}`}
                                 to={`/pokedex/${id + 1}`}>Next &gt;</NavLink>
                        }

                    </div>

                    <div className={style.heading}>

                        <div className={style.number}>
                            #{zeroPad(id, 3)}
                        </div>

                        <h1>{currentPokemon.name.english}</h1>
                        {pokemonSpeciesData.generation &&
                        <div className={style.generation}>
                            {removeDashesAndUnderscores(pokemonSpeciesData.generation.name)}
                        </div>
                        }

                    </div>

                    <div className={style.gallery}>

                        <img className={style.image} onError={(event) => pokemonDefaultImage(event)}
                             src={getPokemonImage(id)}
                             alt={currentPokemon.name.english}/>


                        <div className={style.types}>
                            {currentPokemon.type.map((type) => <PokemonType key={type} typeName={type}/>)}
                        </div>

                        {sprites &&
                        <div className={style.sprites}>
                            {sprites.map((spriteItem) => {
                                return <figure key={spriteItem.name}><img src={spriteItem.src} alt={spriteItem.name}/>
                                    <figcaption>{removeDashesAndUnderscores(spriteItem.name)}</figcaption>
                                </figure>
                            })}
                        </div>
                        }

                    </div>

                    {pokemonSpeciesData.flavor_text_entries &&
                    <div className={style.description}>
                        {cleanText(pokemonSpeciesData.flavor_text_entries.filter((textItem) => textItem.language.name === "en")[0]?.flavor_text)}
                    </div>
                    }

                    <div className={style.info}>

                        {pokemonSpeciesData.genera &&
                        <div className={style.box}>
                            {pokemonSpeciesData.genera.filter((generaItem) => generaItem.language.name === "en")[0]?.genus}
                            <div className={style.boxLabel}>Genera</div>
                        </div>
                        }


                        {pokemonData.weight &&
                        <div className={style.box}>
                            {pokemonData.weight}
                            <div className={style.boxLabel}>Width</div>
                        </div>
                        }

                        {pokemonData.height &&
                        <div className={style.box}>
                            {pokemonData.height}
                            <div className={style.boxLabel}>Height</div>
                        </div>
                        }

                    </div>

                    <div className="row">
                        {pokemonData.stats &&
                        <div className="col-sm-6">

                            <div className={style.stats}>
                                <strong className={style.label}>Stats</strong>
                                <ul>
                                    {pokemonData.stats.map((statsItem) => {
                                        return (
                                            <li key={statsItem.stat.name}>
                                                <span className={style.statName}>{statsItem.stat.name}</span>
                                                <span>{statsItem.base_stat}</span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>

                        </div>
                        }

                        {pokemonData.abilities &&
                        <div className="col-sm-6">
                            <div className={style.abilities}>
                                <strong className={style.label}>Abilities</strong>
                                <ul>
                                    {pokemonData.abilities.map((abilityItem) => {
                                        return <li>{abilityItem.ability.name}</li>
                                    })}
                                </ul>
                            </div>
                        </div>
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PokemonDetail;





















