import React from "react";
import PokemonType from "../PokemonType/PokemonType";
import {Card, CardBody, CardImg, CardText, CardTitle} from "reactstrap";
import style from "./PokemonCard.module.css";
import {pokemonDefaultImage, zeroPad} from "../../utility/utility";
import {NavLink} from "react-router-dom";

function PokemonCard(props) {
    const {name, number, image, types} = props;

    const typesList = types.map((type) => <PokemonType key={`${number}-${type}`} typeName={type}/>);

    return (
        <NavLink to={`/pokedex/${number}`}>
            <Card className={style.card}>
                <CardImg onError={(event) => pokemonDefaultImage(event)} loading="lazy" className={style.image} top
                         width="100%" src={image} alt={name}/>
                <CardBody className="text-center">
                    <CardTitle tag="h5" className={`h3 ${style.title}`}>{name}</CardTitle>
                    <CardText>
                        #{zeroPad(number, 3)}
                    </CardText>
                    <div className={style.types}>
                        {typesList}
                    </div>
                </CardBody>
            </Card>
        </NavLink>
    )
}

export default PokemonCard;