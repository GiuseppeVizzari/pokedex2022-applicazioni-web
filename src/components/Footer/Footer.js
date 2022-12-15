import React from "react";
import style from "./Footer.module.css";
import disco from "../../assets/images/disco.png";
import unimib from "../../assets/images/unimib.jpg";
import {NavLink} from "react-router-dom";

function Footer(props) {
    const {courseName, courseLink, navItems} = props;

    const itemList = navItems.map((item) => {
        return (
            <li key={item.url} className="nav-item">
                <NavLink exact={item.exact}
                         activeClassName={style.active}
                         to={item.url}>
                    {item.text}
                </NavLink>
            </li>
        )
    });

    return (
        <footer className={style.footer}>

            <div className="container-fluid">

                <div className="row">

                    <div className="col">
                        <nav className={style.footerNav}>

                            <ul className="nav flex-column">
                                {itemList}
                            </ul>

                        </nav>

                    </div>

                    <div className="col-md-auto">

                        <div className={`d-flex ${style.copyright}`}>

                            <div id={style.course}>
                                <a href={courseLink} target="_blank">
                                    {courseName}
                                </a>
                            </div>

                            <div id={style.disco} className={style.logo}>
                                <a href="https://www.disco.unimib.it/it" target="_blank">
                                    <img src={disco} alt="disco"/>
                                </a>
                            </div>

                            <div id={style.unimib} className={style.logo}>
                                <a href="https://www.unimib.it/" target="_blank">
                                    <img src={unimib} alt="unimib"/>
                                </a>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </footer>
    )

}

export default Footer;


