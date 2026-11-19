const pokedex = [
  { id: 1, nome: "Bulbasaur", tipos: ["grama", "veneno"], hp: 45 },
  { id: 4, nome: "Charmander", tipos: ["fogo"], hp: 39 },
  { id: 7, nome: "Squirtle", tipos: ["água"], hp: 44 },
  { id: 25, nome: "Pikachu", tipos: ["elétrico"], hp: 35 },
];

function buscarPokemonCB(id, callback) {
  setTimeout(() => {
    const pokemon = pokedex.find((p) => p.id === id);
    if (!pokemon) {
      callback(new Error(`Pokémon ${id} não existe`));
      return;
    }
    callback(null, pokemon);
  }, 1000);
}

function buscarPokemon(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const pokemon = pokedex.find((p) => p.id === id);
      if (pokemon) resolve(pokemon);
      else reject(new Error(`Pokémon ${id} não existe`));
    }, 1000);
  });
}

function cardHTML(p) {
  return `
    <div class="card">
      <h3>#${p.id} ${p.nome}</h3>
      <p>Tipos: ${p.tipos.join(", ")}</p>
      <p>HP: ${p.hp}</p>
    </div>`;
}

function mostrarCarregando() {
  document.getElementById("carregando").hidden = false;
}
function esconderCarregando() {
  document.getElementById("carregando").hidden = true;
}

// ===== ATIVIDADE 1: CALLBACKS =====
const campo = document.getElementById("campo-id");
const botao = document.getElementById("botao-buscar");
const status = document.getElementById("status");
const resultado = document.getElementById("resultado");

botao.addEventListener("click", () => {
  const id = Number(campo.value);
  status.textContent = "Carregando…";
  resultado.innerHTML = "";

  buscarPokemonCB(id, (erro, pokemon) => {
    status.textContent = "";
    if (erro) {
      resultado.innerHTML = `<p class="erro">${erro.message}</p>`;
      return;
    }
    resultado.innerHTML = cardHTML(pokemon);
  });
});

