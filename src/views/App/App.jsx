import React from "react";
import MainTemplate from "../../components/MainTemplate/MainTemplate";
import Home from "../Home/Home";
import { Route, Routes } from 'react-router-dom';
import Pokedex from "../Pokedex/Pokedex";
import Info from "../Info/Info";
import NotFound from "../NotFound/NotFound";
import PokemonDetail from "../PokemonDetail/PokemonDetail";
import ProtectedRoute from "../../auth/ProtectedRoute";
import Logo from "../../assets/images/ball.png";

function App() {

    const nav = [
        { url: "/", text: "Home" },
        { url: "/pokedex", text: "Pokédex" },
        { url: "/info", text: "Info" }
    ];

    return (
        <MainTemplate
            footerCourseName="Applicazioni Web: Progettazione e Sviluppo"
            footerCourseLink="https://elearning.unimib.it/course/view.php?id=61231"
            navItems={nav}
            logo={Logo}
        >

            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/info" element={<Info />} />

                {/* Protected routes - require authentication */}
                <Route path="/pokedex" element={<ProtectedRoute component={Pokedex} />} />
                <Route path="/pokedex/:number" element={<ProtectedRoute component={PokemonDetail} />} />

                {/* 404 page */}
                <Route path="*" element={<NotFound />} />
            </Routes>

        </MainTemplate>
    );
}

export default App;




