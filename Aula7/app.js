const express = require('express')
const app = express()
const porta = 3000
const ipDoServidor = '127.0.0.1'

const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "noticiasBage24h",
    password: "postgres",
    port: 5432,
});

app.use(express.static('public'));

// Middleware para processar dados do formulário
app.use(express.urlencoded({ extended: true }));

app.get('/inserir-noticia', function (req, res) {
    pool.query("INSERT INTO noticias (titulo, resumo, conteudo, data_criacao) VALUES ('titulo teste', 'resumo teste', 'conteudo teste', now())", function (error, results, fields) {

        if (error) throw error;
        //senao esta conectado!
    });
    res.send("noticia cadastrada com sucesso")
});
app.get('/listar-noticias', async function (req, res) {
    try {
        const client = await pool.connect();
        const result = await client.query(' SELECT codigo, titulo, resumo FROM noticias ORDER BY data_criacao DESC ');
        const noticias = result.rows;
        let table = '<table border=1>';
        table += '<h1>Lista de notícias</h1>'
        table += '<tr><th>Código</th><th>título</th><th>Resumo</th><th>Operações</th></tr>';
        noticias.forEach((umaNoticia) => {
            table += `<tr><td>${umaNoticia.codigo}</td><td>${umaNoticia.titulo}</td><td>${umaNoticia.resumo}</td>
            <td><a href="/excluir-noticia/${umaNoticia.codigo}">excluir</a><br><a href="/consultar-noticia/${umaNoticia.codigo}">consultar</a>
            <br><a href="/editar-noticia/${umaNoticia.codigo}">editar</a></td></tr>`;
        });
        table += '</table>'
        table += '<br><a href="/form-cadastrar-noticia">Cadastrar notícia</a><br>'
        client.release();
        res.send(table);
    } catch (err) {
        console.error('Erro ao executar consulta:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/consultar-noticia/:codigo', async function (req, res) {
    var codigo = req.params.codigo
    console.log(codigo)
    //res.send("rota consultar a noticia de codigo = "+codigo)
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT codigo, titulo, conteudo, data_criacao FROM noticias WHERE codigo=' + codigo);
        const noticias = result.rows;

        if (noticias.length === 0) {
            res.status(404).send('Registro não encontrado');
        }
        else {
            const registro = noticias[0];
            res.send(`
    <h1>Dados do Registro</h1>
    <p><b>Código:</b> ${registro.codigo}</p>
    <p><b>Título:</b> ${registro.titulo}</p>
    <p><b>Conteúdo:</b> ${registro.conteudo}</p>
    <p><b>Data de criação:<b> ${registro.data_criacao}</p>
    `);
        }

    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro ao consultar o registro');
    }
});

app.get('/form-cadastrar-noticia', function(req, res){
    res.sendFile(__dirname+"/public/form-cadastro-noticia.html")
    });

app.post('/processar-cadastrar-noticia', function (req, res){
    const { titulo, resumo, conteudo } = req.body

    pool.query(`INSERT INTO noticias (titulo, resumo, conteudo, data_criacao) VALUES ('${titulo}', '${resumo}', '${conteudo}', now())`, function (error, results, fields) {

        if (error) throw error;
        //senao esta conectado!
    });
    res.send("noticia cadastrada com sucesso")
})

app.get('/excluir-noticia/:codigo', async function(req, res){
    var codigo = req.params.codigo
    console.log(codigo)

    try {
        const client = await pool.connect()
        const result = await client.query('DELETE FROM noticias WHERE codigo = $1', [codigo])

         client.release()
 
         if (result.rowCount > 0) {
             res.send(`<h1>Registro com código ${codigo} deletado</h1>`)
         } else {
             res.send(`<h1>Nenhum registro encontrado com código ${codigo}</h1>`)
         }


    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro ao consultar o registro');
    }
})

app.get('/editar-noticia/:codigo', async function(req, res){
    const codigo = req.params.codigo;
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM noticias WHERE codigo = $1', [codigo]);
        client.release();

        if (result.rows.length === 0) {
            return res.send(`<h1>Notícia não encontrada</h1>`);
        }

        const noticia = result.rows[0];

        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Editar Notícia</title>
            </head>
            <body>
                <h2>Editar Notícia</h2>
                <form action="/processar-editar-noticia/${codigo}" method="POST">
                    <input type="hidden" name="codigo" value="${noticia.codigo}" />
                    <label>Título:</label><br />
                    <input type="text" name="titulo" value="${noticia.titulo}" /><br /><br />

                    <label>Resumo:</label><br />
                    <input type="text" name="resumo" value="${noticia.resumo}" /><br /><br />

                    <label>Conteúdo:</label><br />
                    <textarea name="conteudo" cols="40" rows="5">${noticia.conteudo}</textarea><br /><br />

                    <button type="submit">Salvar alterações</button>
                </form>
            </body>
            </html>
        `;

        res.send(html);

    } catch (error) {
        console.error('Erro ao buscar notícia:', error);
        res.status(500).send('Erro ao buscar notícia no banco de dados');
    }
})

app.post('/processar-editar-noticia/:codigo', function(req, res){
    const codigo = req.params.codigo;
    const { titulo, resumo, conteudo } = req.body

    pool.query(`UPDATE noticias SET titulo =  '${titulo}', resumo = '${resumo}',  conteudo = '${conteudo}' WHERE codigo = ${codigo}`, function (error, results, fields) {

        if (error) throw error;
        //senao esta conectado!
    });
    res.send("noticia editada com sucesso")
})

app.listen(porta, ipDoServidor, function () {
    console.log('\n Aplicacao web executando em http://' + ipDoServidor + ':' + porta);
})