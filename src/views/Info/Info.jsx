import React from "react";
import style from "./Info.module.css";

function Info() {

    return (
        <div className={style.infoPage}>
            <h1>About This Pokédex</h1>
            <p>This application was updated in 2025 to React 19.1.1</p>
            <p>A modern Pokédex built with React and Reactstrap, allowing you to browse and search for your favorite Pokémon.</p>
        </div>
    )
}

export default Info;
