const express = require('express')
const { stat } = require('fs')
const path = require('path')
const app = express()
const PORT = 8000

const { Pool } = require("pg")
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'livro-de-visitas',
    password: 'postgres',
    port: 5432,
})

app.use(express.static('public'))
app.use(express.static('style'))

app.use(express.urlencoded({extended: true}))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/visitas', function(req,res){
    res.sendFile(path.join(__dirname, 'public', 'visitas.html'))
})

app.get('/api/visitas', async function(req, res) {
    try{
        const client = await pool.connect();
        const result = await client.query(`SELECT nome, mensagem, data FROM  mensagens_visitantes WHERE status = 'aprovada' ORDER BY codigo DESC`)
        const lista = result.rows
        res.json(lista)
    } catch (err) {
        console.error('Erro ao executar consulta: ', err)
        res.status(500).json({ error: 'Erro interno do servidor '})
    }


})

app.get('/api/adm', async function(req, res) {
    try{
        const client = await pool.connect();
        const result = await client.query(`SELECT codigo, nome, mensagem, data FROM  mensagens_visitantes WHERE status = 'criada' ORDER BY codigo DESC`)
        const lista = result.rows
        res.json(lista)
    } catch (err) {
        console.error('Erro ao executar consulta: ', err)
        res.status(500).json({ error: 'Erro interno do servidor '})
    }


})

app.post('/enviar', function(req, res){
    
    const {nome, mensagem} = req.body
    pool.query(`INSERT INTO mensagens_visitantes (nome, mensagem, data, status) VALUES ('${nome}', '${mensagem}', CURRENT_DATE, 'criada')`, function(error, results, fields){
    
        if (error) throw error;
            //senao esta conectado!
    })

    console.log(`Registro feito com sucesso`)
    res.redirect('/visitas')
})

app.get('/administradores', function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'adm.html'))
})

app.post('/atualizar-status', async function(req, res){
    const {codigo, status } = req.body

    try{
        await pool.query(
            `UPDATE mensagens_visitantes SET status = '${status}' WHERE codigo = '${codigo}'`, function(error,result, fields){
                if (error) throw error;
            //senao esta conectado!
            }
        )
        res.sendStatus(200)
    } catch (err){
        console.error('Erro ao atualizar status:', err)
        res.status(500).json({error: 'Erro ao atulizar status '})
    }
})


app.listen(PORT, function() {
    console.log(`Aplicação em execução em http://localhost:${PORT}/`)
})
