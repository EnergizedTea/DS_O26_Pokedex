import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Trash2 } from "lucide-react";
import { PokemonCard } from "./components/PokemonCard";
import "./App.css";

function App() {
  const [offset, setOffset] = useState(0);
  const limit = 25;
  const [totalPokemon, setTotalPokemon] = useState(0);

  const [pokemon, setPokemon] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [equipo, setEquipo] = useState([]);

  const siguientePagina = () => {
    setOffset((prev) => prev + limit);
  };

  const anteriorPagina = () => {
    setOffset((prev) => (prev - limit < 0 ? 0 : prev - limit));
  };

  async function agregar(p) {
    if (equipo.length >= 6) return;
    if (equipo.some((e) => e.id === p.id)) return; // Evita agregar el mismo pokemon dos veces
    try {
      await setDoc(doc(db, "equipo", String(p.id)), {
        id: p.id,
        nombre: p.name,
        img: p.sprites.other["official-artwork"].front_default,
      });
      setEquipo([...equipo, p]);
    } catch (err) {
      setError("Error al agregar pokemon:", err);
    }
  }

  async function quitar(p) {
    try {
      await deleteDoc(doc(db, "equipo", String(p.id)));
      setEquipo((prev) => prev.filter((item) => item.id !== p.id));
    } catch (err) {
      setError("Error al quitar pokemon: " + err.message);
    }
  }

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
        );

        if (!res.ok) {
          throw new Error(`Error al cargar el pokemon ($res.status)`);
        }

        const data = await res.json();
        console.log(data.results);
        setTotalPokemon(data.count);
        const respuestas = await Promise.all(
          data.results.map((p) => fetch(p.url)),
        );

        // Explicación: Aquí se hace un fetch a la API de Pokemon para obtener los datos de los primeros 5 pokemons. Luego, se hace un Promise.all para esperar a que todas las promesas de fetch se resuelvan y obtener los datos de cada pokemon.

        const datosPokemon = await Promise.all(
          respuestas.map((res) => res.json()),
        );
        // Explicación: Aquí se hace un Promise.all para esperar a que todas las promesas de res.json() se resuelvan y obtener los datos de cada pokemon en formato JSON.

        setPokemon(datosPokemon);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [offset]);

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
      <div
        className="
          min-h-screen 
          bg-neutral-800 
          text-slate-500 
          p-10"
      >
        <header
          className="flex 
          flex-col 
          md:flex-row 
          justify-between 
          items-start 
          md:items-center 
          bg-neutral-600 
          text-slate-100
          p-6
          rounded-tl-[100px] 
          rounded-br-[100px] 
          rounded-tr-none 
          rounded-bl-none
          shadow-lg
          mb-8
          gap-6
          "
        >
          <div className="w-full md:flex-1 flex items-center justify-center gap-4">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-400 ring-4 ring-white/80 shadow-[0_0_15px_rgba(245, 73, 39,0.8)]" />

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-widest text-white drop-shadow-lg">
              Pokédex
            </h1>
          </div>

          <div className="flex flex-col w-full md:flex-1 text-center items-center justify-center gap-4 md:w-auto">
            <section className="equipo">
              <h2 className="text-lg font-semibold text-slate-30">
                Mi equipo ({equipo.length}/6)
              </h2>

              <div className="flex gap-3 overflow-x-auto pb-2 max-w-full">
                {equipo.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">
                    No hay pokemóns en el equipo aún.
                  </p>
                ) : (
                  equipo.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => quitar(p)}
                      title="Clic para quitar del equipo"
                      className="group relative overflow-hidden bg-gray-100 p-2 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none flex flex-col items-center min-w-22.5 text-slate-500 cursor-pointer"
                    >
                      <img
                        src={
                          p?.sprites?.other?.["official-artwork"]
                            ?.front_default || p.img
                        }
                        alt={p.name || p.nombre}
                        className="w-16 h-16 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.50)]"
                      />
                      <span className="text-xs font-bold capitalize truncate max-w-20">
                        {p.name || p.nombre}
                      </span>
                      <div
                        className="
                          absolute inset-0 
                          bg-neutral-900/75 
                          opacity-0 group-hover:opacity-100 
                          transition-opacity duration-200 
                          flex items-center justify-center
                        "
                      >
                        <span className="text-xs font-bold text-gray-200 tracking-wide">
                          <Trash2 className="w-6 h-6 text-gray-200 scale-90 group-hover:scale-100 transition-transform duration-200" />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
            <div className="flex items-center justify-center gap-3">
              <button
                className="px-4 py-2 bg-gray-500 hover:bg-gray-700 disabled:bg-gray-600 disabled:text-slate-500 text-white font-bold rounded-lg transition-colors cursor-pointer text-sm"
                onClick={anteriorPagina}
                disabled={offset === 0 || cargando}
              >
                Anterior
              </button>

              <button
                className="px-4 py-2 bg-gray-500 hover:bg-gray-700 disabled:bg-gray-600 disabled:text-slate-500 text-white font-bold rounded-lg transition-colors cursor-pointer text-sm"
                onClick={siguientePagina}
                disabled={offset + limit >= totalPokemon || cargando}
              >
                Siguiente
              </button>
            </div>
          </div>
        </header>

        {/* <h3>{pokemon ? pokemon.name : "Cargando..."}</h3> */}
        {cargando && <p>Cargando...</p>}
        {error && <p className="error">{error}</p>}
        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-items-center gap-6">
          {pokemon &&
            !cargando &&
            !error &&
            pokemon.map((p) => (
              <PokemonCard key={p.name} pokemon={p} onAgregar={agregar} />
            ))}
          {/* Explicación: Aquí se muestra el componente PokemonCard solo si hay un pokemon cargado y no hay errores */}
        </main>
      </div>
    </>
  );
}

export default App;
