import { useState, useEffect} from 'react'
import './App.css'
import { PokemonCard } from './components/PokemonCard'

function App() {
  const [pokemon, setPokemon] = useState(null)

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
      .then(res => res.json())
      .then(data => setPokemon(data))
  }, [])

  console.log("render")

  return (
    <>
      <h1>Pokedex</h1>
      {/* <h3>{pokemon ? pokemon.name : "Cargando..."}</h3> */}
      {pokemon ? <PokemonCard pokemon={pokemon} /> : "Cargando..."}
      
    </>
  )
}

export default App
