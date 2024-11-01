const $ = selector => document.querySelector(selector) // helper

const pokemonContainer = $('.poke-container')
const pokemons = []

async function getPokemonData(pokemon) {
  const res = await fetch(pokemon)
  const data = await res.json()

  const { name } = data
  pokemons.push(name)
}

async function getPokemons() {
  try {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    if (!res.ok) {
      throw new Error('error fetching data')
    }
    const data = await res.json()
    const { results } = data

    if (Array.isArray(results)) {
      await Promise.all(results.map(async (pokemon) => {
        await getPokemonData(pokemon.url)
      }))
    } else {
      throw new Error('Error in getPokemons')
    }
  } catch (err) {
    console.error('ay caramba')
  }
  console.log(pokemons)
}
getPokemons()