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

// ===== ATIVIDADE 2: ITERATORS =====
function* porTipo(lista, tipo) {
  for (const pokemon of lista) {
    if (pokemon.tipos.includes(tipo)) {
      yield pokemon;
    }
  }
}

const seletor = document.getElementById("seletor");
const proximo = document.getElementById("proximo");
const statusTipo = document.getElementById("status-tipo");
const resultadoTipo = document.getElementById("resultado-tipo");

const tipos = [...new Set(pokedex.flatMap((p) => p.tipos))];
tipos.forEach((tipo) => {
  seletor.innerHTML += `<option value="${tipo}">${tipo}</option>`;
});

let iterador;

seletor.addEventListener("change", () => {
  resultadoTipo.innerHTML = "";
  statusTipo.textContent = "";
  if (!seletor.value) {
    proximo.disabled = true;
    return;
  }
  iterador = porTipo(pokedex, seletor.value);
  proximo.disabled = false;
});

proximo.addEventListener("click", () => {
  const { value, done } = iterador.next();
  if (done) {
    proximo.disabled = true;
    statusTipo.textContent = "Fim da lista";
    return;
  }
  resultadoTipo.innerHTML = cardHTML(value);
});

// ===== ATIVIDADE 3: PROMISES =====
const botaoTime = document.getElementById("botao-time");
const statusTime = document.getElementById("status-time");
const resultadoTime = document.getElementById("resultado-time");

botaoTime.addEventListener("click", () => {
  const ids = [
    Number(document.getElementById("id1").value),
    Number(document.getElementById("id2").value),
    Number(document.getElementById("id3").value),
  ];

  resultadoTime.innerHTML = "";
  statusTime.textContent = "";
  mostrarCarregando();

  Promise.all(ids.map(buscarPokemon))
    .then((time) => {
      resultadoTime.innerHTML = time.map(cardHTML).join("");
    })
    .catch((erro) => {
      statusTime.innerHTML = `<span class="erro">${erro.message}</span>`;
    })
    .finally(() => esconderCarregando());
});

// ===== ATIVIDADE 4: ASYNC / AWAIT =====
const statusLista = document.getElementById("status-lista");
const listaEl = document.getElementById("lista");
let listaAtual = [];

async function carregarPokedex() {
  const salvo = localStorage.getItem("pokedex");
  if (salvo) return JSON.parse(salvo); // cache

  const resposta = await fetch("pokedex.json");
  if (!resposta.ok) throw new Error("Falha ao carregar");

  const dados = await resposta.json();
  localStorage.setItem("pokedex", JSON.stringify(dados));
  return dados;
}

function lerFavoritos() {
  return JSON.parse(localStorage.getItem("favoritos")) || [];
}

function alternarFavorito(id) {
  const favoritos = lerFavoritos();
  const posicao = favoritos.indexOf(id);
  if (posicao >= 0) favoritos.splice(posicao, 1);
  else favoritos.push(id);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function renderizarLista(lista) {
  const favoritos = lerFavoritos();
  listaEl.innerHTML = lista
    .map(
      (p) => `
      <div class="card">
        <h3>#${p.id} ${p.nome}</h3>
        <p>Tipos: ${p.tipos.join(", ")}</p>
        <p>HP: ${p.hp}</p>
        <button data-id="${p.id}">
          ${favoritos.includes(p.id) ? "★ Favorito" : "☆ Favoritar"}
        </button>
      </div>`
    )
    .join("");
}

listaEl.addEventListener("click", (e) => {
  const botaoFav = e.target.closest("button[data-id]");
  if (!botaoFav) return;
  alternarFavorito(Number(botaoFav.dataset.id));
  renderizarLista(listaAtual);
});

async function iniciar() {
  try {
    mostrarCarregando();
    listaAtual = await carregarPokedex();
    renderizarLista(listaAtual);
  } catch (erro) {
    statusLista.textContent = "Erro ao carregar";
  } finally {
    esconderCarregando();
  }
}

iniciar();