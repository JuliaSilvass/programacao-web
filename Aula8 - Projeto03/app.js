const express = require ('express')
const app = express()
const port = 8085
const servIp = '127.0.0.1'
const exphbs = require('express-handlebars')

app.engine('.hbs', exphbs.engine({extname: '.hbs', defaultLayout: 'main'}))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

const tarefas = []
let id = 1

app.get('/', function(req, res){
    res.render('cadastro')
})

app.post('/adicionarTarefa', function(req, res){

    console.log('BODY:', req.body)

    const novaTarefa = {
        id: id++, 
        titulo: req.body.nome, 
        descricao: req.body.descricao,
        responsavel: req.body.responsavel,
        status: req.body.status,
        data_termino: req.body.data_termino, 
        concluida: false,
    }

    // const hoje = new Date().toDateString()
    
    // console.log(novaTarefa.data_termino)
    // console.log(dataFormatada)
    
    // // if (novaTarefa.data_termino === dataFormatada){
    // // } else {
    // //     res.send(`Não é possivel cadastrar data de execução máxima no passado!`)
    // // }

        tarefas.push(novaTarefa)
        res.send(`tarefa feita`)


})

app.listen(port, servIp, function (){
    console.log(`\n Aplicação web executando em http://${servIp}:${port}`)
})