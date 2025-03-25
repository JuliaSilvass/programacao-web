// Função para obter uma frase aleatória do servidor
async function obterFrase() {
    try {
        const response = await fetch('/gerar-frase'); // Rota correta para pegar a frase
        const data = await response.json(); // Converte a resposta JSON
        document.getElementById('mensagem').innerText = data.mensagem; // Atualiza a frase na página
    } catch (error) {
        console.error('Erro ao obter a frase:', error);
    }
}

// Atualiza a frase ao carregar a página
window.onload = obterFrase;

// Atualiza a frase ao clicar no botão
document.getElementById('atualizar').addEventListener('click', obterFrase);
