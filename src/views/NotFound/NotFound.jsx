import React from "react";
import style from "./NotFound.module.css";
import confused from "../../../public/confused-travolta.gif";

function NotFound() {

    return (
        <div className={style.infoPage}>
            <h1>404 - Not Found!</h1>
            <img src={confused} alt="404 not found"/>
        </div>
    )
}

export default NotFound;
