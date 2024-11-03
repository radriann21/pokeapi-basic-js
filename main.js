import { getData } from "./services/getData";
const $ = (selector) => document.querySelector(selector); // helper

const pokemonContainer = $(".poke-container");
const loading = $(".loading");
const pokemons = JSON.parse(localStorage.getItem("pokemons")) || [];

function renderPokemon(pokemon) {
  const pokemonCard = document.createElement("article");
  pokemonCard.classList.add("poke-card");
  pokemonCard.setAttribute('style', `background-color: var(--type-${pokemon.type}`)

  pokemonCard.innerHTML = `
    <img src="${pokemon.img}" class="poke-image" />

    <section class="poke-info">
      <ul class="poke-stats">
        <li class="poke-stat">
          <b>Name:</b> ${pokemon.name}
        </li>
        <li class="poke-stat">
          <b>Health:</b> ${pokemon.health}
        </li>
        <li class="poke-stat">
          <b>Weight:</b> ${pokemon.weight}lbs
        </li>
        <li class="poke-stat">
          <b>Type:</b> ${pokemon.type}
        </li>
      </ul>
    </section>
  `;

  pokemonContainer.appendChild(pokemonCard);
}

function toggleLoading() {
  loading.classList.toggle("show");
}

async function getPokemonData(pokemonUrl) {
  try {
    const data = await getData(pokemonUrl);
    const pokemon = {
      img: data.sprites.front_default,
      name: data.name,
      weight: data.weight,
      health: data.stats[0].base_stat,
      type: data.types[0].type.name,
    }

    pokemons.push(pokemon)
    localStorage.setItem("pokemons", JSON.stringify(pokemons))
    renderPokemon(pokemon)
  } catch (error) {
    console.error('Failed to fetch Pokemon data:', error) 
  }
}

async function getPokemons() {
  toggleLoading();
  try {
    const data = await getData("https://pokeapi.co/api/v2/pokemon?limit=151");
    const { results } = data;

    if (Array.isArray(results)) {
      await Promise.all(results.map(pokemon => getPokemonData(pokemon.url)));
    } else {
      throw new Error('Invalid data structure');
    }
  } catch (error) {
    console.error('Failed to fetch Pokemons:', error);
  } finally {
    toggleLoading();
  }
}


function init() {
  if (pokemons.length === 0) {
    getPokemons()
  } else {
    pokemons.forEach((pokemon) => renderPokemon(pokemon))
  }
}
init()

