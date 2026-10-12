import { useState, useEffect} from 'react'
import './App.css'
import { PokemonCard } from './components/PokemonCard'

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function cargar(){
      setCargando(true)
      setError(null)
      try{
        /* const res = await fetch(`${API}/pokemon/pikachu`) */
        const res = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
        if(!res.ok) throw new Error("Error al cargar el pokemon ($res.status)")
        const data = await res.json()
        setPokemon(data)
      } catch (err){
        setError(err.message)
      }
      finally{
        setCargando(false)
      } 
    }
    cargar()
    /* console.log("Efecto ejecutado!")
    fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
      .then(res => res.json())
      .then(data => setPokemon(data)) */
  }, [])

  console.log("render")

  return (
    <>
      <h1>Pokedex</h1>
      {/* <h3>{pokemon ? pokemon.name : "Cargando..."}</h3> */}
      {cargando && <p>Cargando...</p>}
      {error && <p className='error'>{error}</p>}
      {pokemon && !cargando && !error && <PokemonCard pokemon={pokemon} />}
      {/* Explicación: Aquí se muestra el componente PokemonCard solo si hay un pokemon cargado y no hay errores */}
    </>
  )
}


export default App
