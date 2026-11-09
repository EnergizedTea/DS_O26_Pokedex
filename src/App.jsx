import { useState, useEffect } from "react";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./data/firebase";
import { PokemonCard } from "./components/PokemonCard";
import { cargarPokedex } from "./data/cargarPokedex";
import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [equipo, setEquipo] = useState([]);

  async function agregar(p) {
    //logic
    if (equipo.length >= 6) return;
    if (equipo.some((e) => e.id === p.id)) return; // Evita agregar el mismo pokemon dos veces
    try {
      await setDoc(doc(db, "equipo", String(p.id)), {
        //data
        id: p.id,
        nombre: p.name,
        img: p.sprites.other["official-artwork"].front_default,
      });
      setEquipo([...equipo, p]);
    } catch (err) {
      setError("Error al agregar pokemon:", err); //pantalla
    }
  }

  useEffect(() => {
    cargarPokedex(setCargando, setError, setPokemon);
  }, []);

  console.log("render");

  useEffect(() => {
    getDocs(collection(db, "equipo"))
      .then((snap) =>
        setEquipo(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      )
      .catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <h1>Pokedex</h1>
      <h2>Mi equipo ({equipo.length}/6)</h2>
      <section className="equipo">
        {equipo.map((p) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </section>

      {/* <h3>{pokemon ? pokemon.name : "Cargando..."}</h3> */}
      {cargando && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}

      {/* {pokemon &&
        !cargando &&
        !error &&
        pokemon.map((p) => (
          <PokemonCard key={p.name} pokemon={p} onAgregar={agregar} />
        ))} */}
      {/* Explicación: Aquí se muestra el componente PokemonCard solo si hay un pokemon cargado y no hay errores */}
    </>
  );
}

export default App;
