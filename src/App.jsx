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
        /* const res = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu") */
        const res = await fetch(
          "https://pokeapi.co/api/v2/pokemon?"
        )

        if(!res.ok) {
          throw new Error("Error al cargar el pokemon ($res.status)")
        }

        const data = await res.json()
        const respuestas = await Promise.all(
          data.results.map(p => fetch(p.url))
        )
        // Explicación: Aquí se hace un fetch a la API de Pokemon para obtener los datos de los primeros 5 pokemons. Luego, se hace un Promise.all para esperar a que todas las promesas de fetch se resuelvan y obtener los datos de cada pokemon.

        const datosPokemon = await Promise.all(
          respuestas.map(res => res.json())
        )
        // Explicación: Aquí se hace un Promise.all para esperar a que todas las promesas de res.json() se resuelvan y obtener los datos de cada pokemon en formato JSON.

        setPokemon(datosPokemon)

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

      {pokemon && !cargando && !error && (
        pokemon.map((p) => (
          <PokemonCard key={p.name} pokemon={p} />
        ))
      )}
      {/* Explicación: Aquí se muestra el componente PokemonCard solo si hay un pokemon cargado y no hay errores */}
    </>
  )
}


export default App
