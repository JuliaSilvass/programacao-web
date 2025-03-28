const express = require('express')
const app = express()
const porta = 8085
const ipDoServidor = '127.0.0.1'
const exphbs = require('express-handlebars')

app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }))

app.set('view engine', 'hbs')

app.get('/', function (req, res) {
    res.send(`Site funcionando!`)
})

app.get('/pagina', function (req, res) {
    res.render('pagina')
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
    var qtdCidades = 7;
    var cidadeArray = [

        { cidade: "Bagé", estado: "RS" },
        { cidade: "Curitiba", estado: "PR" },
        { cidade: "Florianópolis", estado: "SC" },
        { cidade: "Porto Alegre", estado: "RS" },
        { cidade: "São Paulo", estado: "SP" },
        { cidade: "Fortaleza", estado: "CE" },
        { cidade: "Recife", estado: "PE" }
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

app.get('/operacoes-fundamentais/:num1/:num2', function (req, res){
    var num1 = parseInt(req.params.num1)
    var num2 = parseInt(req.params.num2)
    
    var soma = num1 + num2
    var subtracao = num1 - num2
    var multiplicacao = num1 * num2
    var divisao = num1 / num2

    var  opeFeitas = {
        "num1": num1,
        "num2": num2,
        "soma": soma, 
        "subtracao": subtracao,
        "multiplicacao": multiplicacao, 
        "divisao": divisao

    }

    res.render('operacoes', {"operacoes": opeFeitas})
})


app.get('/mostrar-dois-objetos', function (req, res){

    var dados = {
        "nome": "Xulinha ltda",
        "cnpj": "00.623.904/0001-73",
        "endereco": "Av. Santa Tecla, 1475", 
        "telefone": "(11) 995377095"
    }

    var gato = {
        "nome": "Heisenberg",
        "idade": "6",
        "peso": "2600"
    }

    res.render('objetos', {"dados": dados, "gato": gato})
})


app.listen(porta, ipDoServidor, function () {
    console.log(`\n Aplicação web executando em http://${ipDoServidor}:${porta}`)
})