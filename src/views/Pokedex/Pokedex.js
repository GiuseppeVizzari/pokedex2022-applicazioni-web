import React, {useState} from 'react';
import PokemonTable from "../../components/PokemonTable/PokemonTable";
import PokemonCardsGrid from "../../components/PokemonCardsGrid/PokemonCardsGrid";
import style from "./Pokedex.module.css";
import clsx from 'clsx';
import PokemonListData from "../../assets/data/pokedex"

function Pokedex() {
    const [displayGrid, setDisplayGrid] = useState("true");

    return (
        <div className="container">

            <div className="row justify-content-center">
                <div className="col">

                    <div className={style.switch}>

                        <div className={clsx(style.option, {[style.active]: displayGrid})}
                             onClick={() => setDisplayGrid(true)}>
                            Grid
                        </div>

                        <div className={clsx(style.option, {[style.active]: !displayGrid})}
                             onClick={() => setDisplayGrid(false)}>
                            Table
                        </div>

                    </div>


                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col">

                    {
                        displayGrid ?
                            <PokemonCardsGrid
                                pokemonList={PokemonListData}
                                col={{xs:1, sm:2, md:3, lg:4, xl:5}}
                            /> :
                            <PokemonTable pokemonList={PokemonListData}/>
                    }

                </div>
            </div>

        </div>

    )

}

export default Pokedex;

