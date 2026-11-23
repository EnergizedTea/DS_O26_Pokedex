const TIPOS = {
  normal: "bg-[#A8A77A] text-slate-900",
  fire: "bg-[#EE8130] text-white",
  water: "bg-[#6390F0] text-white",
  electric: "bg-[#F7D02C] text-slate-900",
  grass: "bg-[#7AC74C] text-slate-900",
  ice: "bg-[#96D9D6] text-slate-900",
  fighting: "bg-[#C22E28] text-white",
  poison: "bg-[#A33EA1] text-white",
  ground: "bg-[#E2BF65] text-slate-900",
  flying: "bg-[#A98FF3] text-slate-900",
  psychic: "bg-[#F95587] text-white",
  bug: "bg-[#A6B91A] text-slate-900",
  rock: "bg-[#B6A136] text-slate-900",
  ghost: "bg-[#735797] text-white",
  dragon: "bg-[#6F35FC] text-white",
  dark: "bg-[#705746] text-white",
  steel: "bg-[#B7B7CE] text-slate-900",
  fairy: "bg-[#D685AD] text-slate-900",
};

export const PokemonCard = ({ pokemon, onAgregar, onQuitar }) => {
  const image = pokemon?.sprites?.other?.["official-artwork"]?.front_default;

  return (
    <article className="tarjeta">
      <div>
        <img src={image} alt={pokemon?.name} width="200" />
        <h2>
          #{pokemon?.id} {pokemon?.name}
        </h2>
        <ul className="tipos">
          {pokemon?.types?.map((t) => (
            <li key={t.type.name}>{t.type.name}</li>
          ))}
        </ul>
        <p>
          Altura: {pokemon?.height / 10}m - Peso: {pokemon?.weight / 10}kg
        </p>
        {onAgregar && (
          <button onClick={() => onAgregar(pokemon)}>Agregar</button>
        )}
        {onQuitar && <button onClick={() => onQuitar(pokemon)}>Quitar</button>}
      </div>
    </article>
  );
};
