const express = require('express')
const path = require('path')
const app = express()
const PORT = 8000

app.use(express.urlencoded({extended: true}))
let visitas = [];

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/visitas', function(req,res){
    res.sendFile(path.join(__dirname, 'public', 'visitas.html'))

    
})

app.post('/enviar', function(req, res){

    const {nome, mensagem} = req.body
    const data = new Date().toLocaleDateString()
    const arrayVisitas = {
        nome: nome,
        mensagem: mensagem, 
        data: data
    }

    visitas.push(arrayVisitas)
    
    console.log(`Nome: ${arrayVisitas.nome}`)
    console.log(`Mensagem: ${arrayVisitas.mensagem}`)
    console.log(`Data de registro: ${arrayVisitas.data}`)

    
    console.log(`Registro feito com sucesso`)
    res.send(`Registro feito com sucesso!`)
})

app.listen(PORT, function() {
    console.log(`Aplicação em execução em http://localhost:${PORT}/`)
})
