const express = require('express')
const app = express()
const porta = 8085
const ipDoServidor = '127.0.0.1'
const exphbs = require('express-handlebars')

app.engine('.handlebars', exphbs.engine({ extname: '.handlebars', defaultLayout: 'main' }))

app.set('view engine', 'handlebars');

//rotas:
app.get('/', function (req, res) {
    res.send("Bem vindos ao meu site")
});
app.listen(porta, ipDoServidor, function () {
    console.log('\n Aplicacao web executando em http://' + ipDoServidor + ':' + porta);
})

app.get('/exemplo-usuario', function (req, res) {
    var umUsuarioTeste = {

        "nome": "Julia Silva",
        "telefone": "98535-4412",
        "email": "juliasilvass01@gmail.com",
        "endereco": "av. santa tecla"
    }

    res.render('mensagem', { "usuario": umUsuarioTeste }); //chama o método
    // render que renderiza o template mensagem.handlebars, armazenado
    // no diretório Views do projeto, e passando um objeto umUsuarioTeste
});

app.get('/exemplo-usuario-complexo', function (req, res) {
    var usuarioObjComplexo = {

        nome: "Julia Silva",
        telefone: "99792-1296",
        email: "juliasilvass01@gmail.com",
        endereco: {
            rua: "Santa tecla",
            numero: "25",
            complemento: "Apto 304",
            cidade: "Bagé",
            estado: "RS"
        }
    }

    res.render('mensagem_2', { "usuario_novo": usuarioObjComplexo });
    //chama o método render que renderiza o template mensagem_2.handlebar,
    //armazenado no diretório Views do projeto, e passando um objeto
    //usuarioObjComplexo
});

app.get('/exemplo-array-usuarios', function (req, res) {
    var qtdCidades = 4;
    var cidadeArray = [

        { cidade: "Bagé", estado: "RS" },
        { cidade: "Curitiba", estado: "PR" },
        { cidade: "Florianópolis", estado: "SC" },
        { cidade: "Porto Alegre", estado: "RS" }, 
        { cidade: "São Paulo", estado: "SP"},
        { cidade: "Fortaleza", estado: "CE"},
        { cidade: "Recife", estado: "PE"}
    ]
    res.render('cidades', {
        saida: {
            "qtdCidades": qtdCidades,
            "array_de_cidades": cidadeArray
        }
    });
    //chama o método render que renderiza o template cidades.handlebar,
    //armazenado no diretório Views do projeto, e passando um objeto
    //array_de_cidades
});