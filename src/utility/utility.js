import Ball from "../assets/images/ball.png";

export const zeroPad = (num, places) => String(num).padStart(places, '0');

export const getPokemonImage = (id) => `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${zeroPad(id, 3)}.png`;

export const pokemonDefaultImage = (onErrorEvent) =>  onErrorEvent.target.src = Ball;

export const removeDashesAndUnderscores  = (text) => text.replace(/[\-_]/g, ' ');

export const cleanText = (text) => text.replace(/[^ -~]+/g, " ");