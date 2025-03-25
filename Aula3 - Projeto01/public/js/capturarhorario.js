// Função para obter uma frase aleatória do servidor
async function obterHorario() {
    try {
        const response = await fetch('/gerar-horario') // Rota correta para os horários
        const data = await response.json() // Converte a resposta JSON

        document.getElementById('relogio_saoPaulo').innerText = data.saoPaulo // Atualiza o horario na pagina 
        document.getElementById('relogio_costaRica').innerText = data.costaRica
        document.getElementById('relogio_Madrid').innerText = data.madrid
        document.getElementById('relogio_hongKong').innerText = data.hongKong
        document.getElementById('relogio_newYork').innerText = data.novaYork
    } catch (error) {
        console.error('Erro ao obter o horario:', error)
    }
}


// Atualiza a frase ao carregar a página
window.onload = obterHorario

// Atualiza a frase ao clicar no botão
document.getElementById('atualizarHora').addEventListener('click', obterHorario)
