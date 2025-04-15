const express = require ('express')
const path = require ('path')
const { toASCII } = require('punycode')
const app = express()
const PORT = 3000

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))


app.get('/', function(req,res){
    res.send('estou funcionando!')
})

app.get('/pedido-online', function(req, res){
    res.sendFile(path.join(__dirname, '/public/pedido.html'))
})

app.post('/processar-pedido', function(req, res){

    console.log('BODY:', req.body); //Muito util, verifica tudo que o backend esta recebendo


    const nome = req.body.cliente_nome
    const endereco = req.body.cliente_endereco
    const bairro = req.body.cliente_bairro
    const entrega = req.body.tipo_entrega
    const item_pizza_grande = req.body.item_pizza_grande
    const item_pizza_media = req.body.item_pizza_media
    const item_pizza_pequena = req.body.item_pizza_pequena
    const item_refrigerante_2L = req.body.item_refrigerante_2L
    const qtd_pizza_media = req.body.qtd_pizza_media
    const qtd_pizza_grande = req.body.qtd_pizza_grande
    const qtd_pizza_pequena = req.body.qtd_pizza_pequena
    const qtd_refrigerante = req.body.qtd_refrigerante_2L

    let total = 0 

    if (entrega === 'por_motoboy') {
        total += 10;
    } else if (entrega !== 'balcao') {
        console.log(`Não foi possível calcular o total`);
    }

    if(item_pizza_grande === 'sim') {
        total += (qtd_pizza_grande * 60)
    }
    if (item_pizza_media  === 'sim'){
        total += (qtd_pizza_media * 50) 
    }
    if (item_pizza_pequena  === 'sim'){
        total += (qtd_pizza_pequena * 40)
    }
    if (item_refrigerante_2L  === 'sim'){
        total += (qtd_refrigerante * 10)    
    }

    var html_saida = "<h3>Pedido recebido com sucesso</h3>"
    html_saida = html_saida + "<b>Dados do(a) cliente:</b>"
    html_saida = html_saida + "<br />"
    html_saida = html_saida + "<br /> Nome: " + nome
    html_saida = html_saida + "<br /> Endereço: " + endereco
    html_saida = html_saida + "<br /> Bairro: " + bairro
    html_saida = html_saida + "<br />"
    html_saida = html_saida + "<br />"
    html_saida = html_saida + "<b>Itens de pedido:</b>"
    html_saida = html_saida + "<br />"
    html_saida = html_saida + "<br /> Pizza grande: " + qtd_pizza_grande
    html_saida = html_saida + "<br /> Pizza média: " + qtd_pizza_media
    html_saida = html_saida + "<br />Pizza pequena: " + qtd_pizza_pequena
    html_saida = html_saida + "<br /> Refrigerante 2L: " + qtd_refrigerante
    html_saida = html_saida + "<br /><br /> <b>Entrega:</b> " + entrega 
    html_saida = html_saida + "<br /><br /> Total a pagar: R$ " + total
    res.send(html_saida)
})


app.listen(3000, function(){
    console.log('Aplicação em execução em http://localhost:3000/')
})
