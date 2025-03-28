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

app.listen(3000, function(){
    console.log('Aplicação em execução em http://localhost:3000/')
})
