document.getElementById('formSenha').addEventListener('submit', function(event){
    event.preventDefault()
    const tipo = document.getElementById('tipoSenha').value
    const retorno = document.getElementById('retorno').value
    fetch(`${window.location.origin}/gerador-senhas/${tipo}/${retorno}`, {
        method: 'GET'
    })
        .then(res => {
            console.log('Resposta bruta:', res)
            if (retorno === 'xml') {
                return res.text()
            } else {
                return res.json() 
            }
        })
        .then(data => {
          if (retorno === 'tela') {
            console.log('Resposta em JSON:', data);
            document.getElementById('resposta').innerText = data.mensagem
          } else if (retorno === 'xml') {
            document.getElementById('resposta').innerText = data;
          }
        })
        .catch(err => {
            console.error('Erro na requisição:', err)
        })
})
