function escolher(opcao) {
    fetch(`${window.location.origin}/gerador-senhas/${opcao}`, {
        method: 'GET'
    })
        .then(res => {
            console.log('Resposta bruta:', res);
            return res.json();
        })
        .then(data => {
            console.log('Resposta em JSON:', data);
            document.getElementById('resposta').innerText = data.mensagem;
        })
        .catch(err => {
            console.error('Erro na requisição:', err);
        });
}