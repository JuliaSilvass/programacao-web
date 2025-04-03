const express = require('express')
const path = require('path')
const app = express()
const PORT = 8000

app.use(express.static('public'))
app.use(express.static('style'))

app.use(express.urlencoded({extended: true}))
let visitas = [];

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/visitas', function(req,res){
    res.sendFile(path.join(__dirname, 'public', 'visitas.html'))
})

app.get('/api/visitas', function(req, res) {
    res.json(visitas) // Retorna a lista de visitas no formato JSON
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
    
    // console.log(`Nome: ${arrayVisitas.nome}`)
    // console.log(`Mensagem: ${arrayVisitas.mensagem}`)
    // console.log(`Data de registro: ${arrayVisitas.data}`)
    
    console.log(`Registro feito com sucesso`, arrayVisitas)
    res.redirect('/visitas')
})

// app.get('/listaVisitas', function(req, res) {
//     let html = `
//         <!DOCTYPE html>
//         <html lang="pt-BR">
//         <head>
//             <meta charset="UTF-8">
//             <title>Lista de Visitas</title>
//             <style>
//                 body { font-family: Arial, sans-serif; }
//                 table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//                 th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//                 th { background-color: #f2f2f2; }
//             </style>
//         </head>
//         <body>
//             <h2>Lista de Visitas</h2>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Nome</th>
//                         <th>Mensagem</th>
//                         <th>Data</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//     `

//     visitas.forEach(visita => {
//         html += `
//             <tr>
//                 <td>${visita.nome}</td>
//                 <td>${visita.mensagem}</td>
//                 <td>${visita.data}</td>
//             </tr>
//         `
//     })

//     html += `
//                 </tbody>
//             </table>
//             <br>
//             <a href="/visitas">Voltar ao formulário</a>
//         </body>
//         </html>
//     `

//     res.send(html)
// })


app.listen(PORT, function() {
    console.log(`Aplicação em execução em http://localhost:${PORT}/`)
})
