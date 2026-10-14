import { useState, useEffect} from 'react'
import { collection, doc, getDocs, setDoc} from 'firebase/firestore'
import { db } from './firebase'
import { PokemonCard } from './components/PokemonCard'
import './App.css'

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [equipo, setEquipo] = useState([])

 async function agregar(p){
    if (equipo.length >= 6) return
    if (equipo.some((e) => e.id === p.id)) return // Evita agregar el mismo pokemon dos veces
    try {
      await setDoc(doc(db, 'equipo', String(p.id)), {
        id: p.id,
        nombre: p.name, 
        img: p.sprites.other['official-artwork'].front_default
    })
      setEquipo([...equipo, p])
    } catch (err) {
      setError("Error al agregar pokemon:", err)
  }
 }

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
        console.log(data.results)
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


  useEffect(() => {
    getDocs(collection(db, 'equipo'))
    .then((snap)=>
      setEquipo(snap.docs.map((d) => ({id: d.id, ...d.data()})))
    )
    .catch((e) => setError(e.message))
  }, [])

  return (
    <>
      <h1>Pokedex</h1>
      <h2>Mi equipo ({equipo.length}/6)</h2>
      <section className='equipo'>
        {equipo.map((p) => <PokemonCard key ={p.id} pokemon ={p} />)}
      </section>


      {/* <h3>{pokemon ? pokemon.name : "Cargando..."}</h3> */}
      {cargando && <p>Cargando...</p>}
      {error && <p className='error'>{error}</p>}

      {pokemon && !cargando && !error && (
        pokemon.map((p) => (
          <PokemonCard key={p.name} pokemon={p} onAgregar={agregar} />
        ))
      )}
      {/* Explicación: Aquí se muestra el componente PokemonCard solo si hay un pokemon cargado y no hay errores */}
    </>
  )
}


export default App
