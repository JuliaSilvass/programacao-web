const express = require ('express')
const app = express()
const port = 8085
const servIp = '127.0.0.1'
const exphbs = require('express-handlebars')

app.engine('.hbs', exphbs.engine({extname: '.hbs', defaultLayout: 'main'}))

app.set('view engine', 'handlebars')

app.listen(port, servIp, function (){
    console.log(``)
})