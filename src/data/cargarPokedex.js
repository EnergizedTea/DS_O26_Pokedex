export async function cargarPokedex(setCargando, setError, setPokemon) {
  setCargando(true);
  setError(null);
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?");

    if (!res.ok) {
      throw new Error("Error al cargar el pokemon ($res.status)");
    }

    const data = await res.json();
    console.log(data.results); //
    const respuestas = await Promise.all(data.results.map((p) => fetch(p.url)));

    // Explicación: Aquí se hace un fetch a la API de Pokemon para obtener los datos de los primeros 5 pokemons. Luego, se hace un Promise.all para esperar a que todas las promesas de fetch se resuelvan y obtener los datos de cada pokemon.

    const datosPokemon = await Promise.all(respuestas.map((res) => res.json()));
    // Explicación: Aquí se hace un Promise.all para esperar a que todas las promesas de res.json() se resuelvan y obtener los datos de cada pokemon en formato JSON.

    setPokemon(datosPokemon);
  } catch (err) {
    setError(err.message);
  } finally {
    setCargando(false);
  }
}
