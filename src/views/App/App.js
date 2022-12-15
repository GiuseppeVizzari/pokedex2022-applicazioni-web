import React from "react";
import MainTemplate from "../../components/MainTemplate/MainTemplate";
import Home from "../Home/Home";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Pokedex from "../Pokedex/Pokedex";
import Info from "../Info/Info";
import PokemonDetail from "../PokemonDetail/PokemonDetail";
import Logo from "../../assets/images/ball.png";

function App() {

    const nav = [
        {url: "/", text: "Home", exact: true},
        {url: "/pokedex", text: "Pokédex", exact: false},
        {url: "/info", text: "Info", exact: true}
    ];

    return (

        <BrowserRouter>

            <MainTemplate
                footerCourseName="Applicazioni Web: Progettazione e Sviluppo"
                footerCourseLink="https://elearning.unimib.it/course/view.php?id=44672"
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

        </BrowserRouter>
    );
}

export default App;




