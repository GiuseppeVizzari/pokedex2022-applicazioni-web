import React from "react";
import MainTemplate from "../../components/MainTemplate/MainTemplate";
import Home from "../Home/Home";
import {HashRouter as Router} from 'react-router-dom';
import {Route, Routes} from 'react-router-dom';
import Pokedex from "../Pokedex/Pokedex";
import Info from "../Info/Info";
import PokemonDetail from "../PokemonDetail/PokemonDetail";
import Logo from "../../assets/images/ball.png";

function App() {

    const nav = [
        {url: "/", text: "Home", exact: true},
        {url: "/pokedex", text: "Pokédex", exact: true},
        {url: "/info", text: "Info", exact: true}
    ];

    return (

        <Router>

            <MainTemplate
                footerCourseName="Applicazioni Web: Progettazione e Sviluppo"
                footerCourseLink="https://elearning.unimib.it/course/view.php?id=51512"
                navItems={nav}
                logo={Logo}
            >

                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/pokedex" element={<Pokedex />}/>
                    <Route path="/info" element={<Info />}/>
                    <Route path="/pokedex/:number" element={<PokemonDetail />}/>
                </Routes>

            </MainTemplate>

        </Router>
    );
}

export default App;




