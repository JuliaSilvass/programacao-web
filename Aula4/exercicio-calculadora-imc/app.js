const express = require ('express')
const path = require ('path')
const app = express()
const PORT = 3000

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))


app.get('/', function(req,res){
    res.send('estou funcionando!')
})

app.get('/calculadora-imc', function(req, res){
    res.sendFile(path.join(__dirname, '/public/formIMC.html'))
})

app.post('/process-form', function(req,res){
    const peso = parseFloat(req.body.peso)
    const altura = parseFloat(req.body.altura)

    if(!peso || !altura){
        return res.send('Por favor, preencha os campos do formulario')
    }

    const imc = peso /(altura * altura)
    
    if (imc < 18.5) {
        res.send(`Seu IMC é: ${imc} e a classificação magreza`)
    } else if (imc >= 18.5 && imc < 25){
        res.send(`Seu IMC é: ${imc} e a classificação normal`)
    } else if (imc >= 25 && imc < 30){
        res.send(`Seu IMC é: ${imc} e a classificação sobrepeso`)
    } else if (imc >= 30 && imc < 35){
        res.send(`Seu IMC é: ${imc} e a classificação obesidade grau I`)
    } else if (imc >= 3 && imc < 40){
        res.send(`Seu IMC é: ${imc} e a classificação obesidade grau II`)
    } else if (imc >= 40){
        res.send(`Seu IMC é: ${imc} e a classificação obesidade grau III`)
    } else {
        res.send(`Seu IMC é: ${imc} porém sem classificação`)
    }
})

app.listen(3000, function(){
    console.log('Aplicação em execução em http://localhost:3000/')
})
