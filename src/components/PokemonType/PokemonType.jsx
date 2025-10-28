import React from "react";
import style from "./PokemonType.module.css";
import clsx from "clsx";

function PokemonType(props) {
    const {typeName} = props;

    return (
        <div className={clsx(style.type, style[typeName.toLowerCase()])} data-type={typeName}/>
    )
}

export default PokemonType;

