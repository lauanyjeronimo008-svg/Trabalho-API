const botao = document.getElementById("botaoBuscar");
const input = document.getElementById("filme");
const resultado = document.getElementById("resultado");
const mensagem = document.getElementById("mensagem");

// COLOQUE A SUA CHAVE DA API DO TMDB AQUI
const API_KEY = "COLOQUE_SUA_CHAVE_AQUI";

botao.addEventListener("click", buscarFilmes);

input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        buscarFilmes();
    }
});

async function buscarFilmes() {

    const nomeFilme = input.value.trim();

    resultado.innerHTML = "";
    mensagem.innerHTML = "";

    if (nomeFilme === "") {
        mensagem.innerHTML = "⚠️ Digite o nome de um filme!";
        return;
    }

    mensagem.innerHTML = "🎬 Procurando filmes...";

    try {

        const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(nomeFilme)}&language=pt-BR`;

        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro ao conectar com a API.");
        }

        const dados = await resposta.json();

        console.log(dados);

        if (dados.results.length === 0) {
            mensagem.innerHTML = "😕 Nenhum filme encontrado.";
            return;
        }

        mensagem.innerHTML = "";

        dados.results.forEach(function(filme) {

            let poster;

            if (filme.poster_path) {
                poster = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
            } else {
                poster = "https://via.placeholder.com/500x750?text=Sem+Imagem";
            }

            let ano = "Não informado";

            if (filme.release_date) {
                ano = filme.release_date.substring(0, 4);
            }

            let nota = "Sem avaliação";

            if (filme.vote_average) {
                nota = filme.vote_average.toFixed(1);
            }

            let sinopse = filme.overview;

            if (!sinopse) {
                sinopse = "Sinopse não disponível.";
            }

            resultado.innerHTML += `
                <div class="card">

                    <img
                        src="${poster}"
                        alt="Poster do filme ${filme.title}"
                    >

                    <div class="card-info">

                        <h3>${filme.title}</h3>

                        <p>
                            📅 <strong>Ano:</strong> ${ano}
                        </p>

                        <p>
                            ⭐ <strong>Avaliação:</strong> ${nota}
                        </p>

                        <p class="sinopse">
                            📝 ${sinopse}
                        </p>

                    </div>

                </div>
            `;

        });

    } catch (erro) {

        console.error(erro);

        mensagem.innerHTML = `❌ ${erro.message}`;

    }

}