const express = require ('express')
const path = require ('path')
const app = express()
const PORT = 3000

app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')))
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req,res){
    res.sendFile(path.join (__dirname, '/public/index.html'))
})

app.get('/frases', function(req, res){
    res.sendFile(path.join(__dirname, '/public/frases.html'))
})

app.get('/gerar-frase', function (req, res) {
    const mensagem = [
        "Se a vida te der limões, pergunte se ela não pode dar uma pizza de vez em quando também.",
        "Às vezes tudo que você precisa é de uma boa noite de sono. Ou de uma semana. Ou de férias de um ano.",
        "Nada como um novo dia para lembrar que não sei o que estou fazendo, mas vou com fé!",
        "A jornada é mais importante que o destino. Mas um GPS ajuda quando você não faz ideia de onde está indo.",
        "Seja paciente! Até o Wi-Fi leva tempo para conectar, por que você não pode demorar um pouquinho também?",
        "Quando a vida fechar uma porta, abre a geladeira. Quem sabe não encontra alguma motivação por lá?",
        "Dizem que o dinheiro não traz felicidade, mas eu ficaria bem feliz com uma folguinha no banco.",
        "Se tudo der errado, pelo menos aprendi a nunca confiar em mim quando digo 'só mais cinco minutinhos'.",
        "Por mais que a vida seja difícil, eu sei que sou resiliente? ou que sou teimoso. Depende do ponto de vista.",
        "Sonhe grande! E, se der errado, pelo menos a queda será divertida."
    ];

    const msgAleatoria = mensagem[Math.floor(Math.random() * mensagem.length)];
    res.json({ mensagem: msgAleatoria });
})

app.get('/relogio', function(req, res){
    res.sendFile(path.join(__dirname, '/public/relogio.html'))
})

app.get('/gerar-horario', function(req, res){
    const date = new Date()

    const horarios = {
        novaYork: new Intl.DateTimeFormat("pt-BR", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(date),
        costaRica: new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Costa_Rica", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(date),
        madrid: new Intl.DateTimeFormat("pt-BR", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(date),
        hongKong: new Intl.DateTimeFormat("pt-BR", { timeZone: "Asia/Hong_Kong", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(date),
        saoPaulo: new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(date)
    }
    res.json(horarios)
})

app.get('/senha', function(req, res){
    res.sendFile(path.join(__dirname, '/public/senha.html'))
})

app.get('/gerador-senhas/:tipoSenha/:tipoRetorno', (req, res) => {

    var tipoSenha = req.params.tipoSenha
    var tipoRetorno = req.params.tipoRetorno
    let senha = '';
    const letras = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numeros = '0123456789'

    if (tipoSenha === 'numero') {
        for (let i = 0; i < 6; i++) {
            const indice = Math.floor(Math.random() * numeros.length)
            senha += numeros[indice]  
        }    
    } else if (tipoSenha === 'letra') {
        for(let i = 0; i < 6; i++){
            const indice = Math.floor(Math.random() * letras.length)
            senha += letras[indice]
        }
    } else {
        for(let i = 0; i < 3; i++){
            const indice = Math.floor(Math.random() * letras.length)
            senha += letras[indice]
        }
        for (let i = 0; i < 3; i++) {
            const indice = Math.floor(Math.random() * numeros.length)
            senha += numeros[indice]   
        }

        senha = senha.split('').sort(() => 0.5 - Math.random()).join('')
    }
    
    if (tipoRetorno === 'tela') {
        res.json({mensagem: `Esta é a senha gerada: ${senha}`})
    } else if (tipoRetorno === 'xml') {
        const dataHoje = new Date().toLocaleDateString('pt-BR');
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
                        <retornoSite>
                        <tipo>${tipoSenha}</tipo>
                        <senha data="${dataHoje}">${senha}</senha>
                        </retornoSite>`
                        
        res.set('Content-Type', 'application/xml');
        res.setHeader('Content-Disposition', 'attachment; filename="senha.xml"');
        res.send(xml);
    } else {
        res.status(400).json({ erro: 'Tipo de retorno inválido' });
    }

  });

app.listen(3000, function(){
    console.log('Aplicação em execução em http://localhost:3000/')
})
