const express = require ('express')
const path = require ('path')
const app = express()
const PORT = 3000

app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')))

app.get('/', function(req,res){
    res.sendFile(path.join (__dirname, '/public/index.html'))
})

app.get('/frases', function(req, res){
    res.sendFile(path.join (__dirname, 'public/frases.html'))
})

app.listen(3000, function(){
    console.log('Aplicação em execução em http://localhost:3000/')
})
