const express = require ('express')
const path = require ('path')
const app = express()
const PORT = 3000

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req,res){
    res.send('estou funcionando!')
})


app.listen(3000, function(){
    console.log('Aplicação em execução em http://localhost:3000/')
})
