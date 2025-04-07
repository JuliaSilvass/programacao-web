const express = require ('express')
const app = express()
const port = 8085
const servIp = '127.0.0.1'
const exphbs = require('express-handlebars')

app.engine('.hbs', exphbs.engine({extname: '.hbs', defaultLayout: 'main'}))

app.set('view engine', 'hbs')

const tarefas = []
let id = 1

app.get('/', function(req, res){
    res.render('cadastro')
})

app.get('/adicionarTarefa', function(req, res){
    const novaTarefa = {
        id: id++, 
        titulo: titulo, 
        descricao: descricao, 
        concluida: false,
    }

    tarefas.push(novaTarefa)
})

app.listen(port, servIp, function (){
    console.log(`\n Aplicação web executando em http://${servIp}:${port}`)
})