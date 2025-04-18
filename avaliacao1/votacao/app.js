const { error } = require('console')
const express = require ('express')
const app = express()
const port = 8085
const servIp = '127.0.0.1'
const path = require('path')
const { Pool } = require('pg')
const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'votacao_web',
    password: 'postgres',
    port: 5432
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))


app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/administrador', function (req, res){
    res.sendFile(path.join(__dirname, 'public', 'administrador.html'))
})

app.get('/eleitor', function (req, res){
    res.sendFile(path.join(__dirname, 'public', 'eleitor.html'))
})

app.get('/eleitor/cadastrar', function(req,res){
    res.sendFile(path.join(__dirname, 'public', 'eleitor-cadastro.html'))
})

app.post('/pagina-alvo-dados', function(req, res){
    const { numero_eleitor, nome, senha, data_nascimento} = req.body

    pool.query(`INSERT INTO eleitores (numero_eleitor, nome, senha, data_nascimento) VALUES ('${numero_eleitor}', '${nome}', '${senha}', '${data_nascimento}')`, function(error, results, fields){
        if (error) throw error
            //senão esta conectado!
    })

    var html_saida = "Operação realizada com sucesso"
    html_saida = html_saida + "<br />"
    html_saida = html_saida + "<a href='/administrador'>Voltar</a> "

    res.send(html_saida)
})

app.get('/eleitor/dados', async function(req, res) {
    try{
        const client = await pool.connect();
        const result = await client.query(`SELECT numero_eleitor, nome, data_nascimento FROM eleitores ORDER BY nome`)
        const lista = result.rows
        res.json(lista)
    } catch (err) {
        console.error('Erro ao executar consulta: ', err)
        res.json({ error: 'Erro interno do servidor '})
    }
    
    
})
app.get('/eleitor/listagem', function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'listagem-eleitor.html'))
})

app.get('/candidato/cadastrar', function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'candidato-cadastro.html'))
})

app.post('/cadastrar-candidato', function(req, res){
    const { nome, numero_partido} = req.body

    pool.query(`INSERT INTO candidatos (numero_partido, nome) VALUES ('${numero_partido}', '${nome}')`, function(error, results, fields){
        if (error) throw error
            //senão esta conectado!
    })

    var html_saida = "Operação realizada com sucesso"
    html_saida = html_saida + "<br />"
    html_saida = html_saida + "<a href='/administrador'>Voltar</a> "

    res.send(html_saida)
})

app.get('/candidato/listagem', function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'listagem-candidato.html'))
})

app.get('/candidato/dados', async function(req, res) {
    try{
        const client = await pool.connect();
        const result = await client.query(`SELECT numero_partido, nome FROM candidatos ORDER BY nome`)
        const lista = result.rows
        res.json(lista)
    } catch (err) {
        console.error('Erro ao executar consulta: ', err)
        res.json({ error: 'Erro interno do servidor '})
    }
    
    
})

app.get('/candidato/excluir/:nome', async function (req, res){
    var nome = req.params.nome
    console.log(nome)

    try {
        const client = await pool.connect()
        const result = await client.query('DELETE FROM candidatos WHERE nome = $1', [nome])

         client.release()
 
         if (result.rowCount > 0) {
            var html_saida = "Operação realizada com sucesso"
            html_saida = html_saida + "<br />"
            html_saida = html_saida + "<a href='/administrador'>Voltar</a> "
         } else {
            var html_saida = "Nenhum registro encontrado"
            html_saida = html_saida + "<br />"
            html_saida = html_saida + "<a href='/administrador'>Voltar</a> "
         }


    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.send('Erro ao consultar o registro');
    }



    res.send(html_saida)
})

app.get('/votar', function (req, res){
    res.sendFile(path.join(__dirname, 'public', 'votar.html'))
})

app.post('/inserir-voto', function(req, res){
    const { } = req.body

    pool.query(`INSERT INTO eleitores (numero_eleitor, nome, senha, data_nascimento) VALUES ('${numero_eleitor}', '${nome}', '${senha}', '${data_nascimento}')`, function(error, results, fields){
        if (error) throw error
            //senão esta conectado!
    })

    var html_saida = "Operação realizada com sucesso"
    html_saida = html_saida + "<br />"
    html_saida = html_saida + "<a href='/administrador'>Voltar</a> "

    res.send(html_saida)
})


app.listen(port, servIp, function (){
    console.log(`\n Aplicação web executando em http://${servIp}:${port}`)
})