const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path'); 

const app = express();

// Conexão com banco
const sequelize = new Sequelize('pizzaria_do_luigi', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
});

// Modelo alinhado à tabela pedidos
const Pedido = sequelize.define('Pedido', {
    codigo_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cliente_nome: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    cliente_endereco: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    qtd_pizzas_grandes: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    qtd_pizzas_medias: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    qtd_pizzas_pequenas: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    tele_entrega: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    total_a_pagar: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    data_hora: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'pedidos',
    timestamps: false
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Config Handlebars
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Sincroniza banco
sequelize.sync().then(() => console.log('Banco pronto.'));

// Rotas

// Página principal com formulário
app.get('/', (req, res) => {
    res.render('pedido');
});

app.get('/pedido-estatico', (req, res) => {
  res.sendFile(path.join(__dirname, 'pedido-online', 'formulario-pedidos-pizza.html'));
});

// Processar pedido
app.post('/processar-pedido', async (req, res) => {
    try {
        const pedido = await Pedido.create({
            cliente_nome: req.body.cliente_nome,
            cliente_endereco: req.body.cliente_endereco,
            tele_entrega: req.body.tipo_entrega === 'por_motoboy', // converte para boolean
            qtd_pizzas_grandes: parseInt(req.body.qtd_pizza_grande) || 0,
            qtd_pizzas_medias: parseInt(req.body.qtd_pizza_media) || 0,
            qtd_pizzas_pequenas: parseInt(req.body.qtd_pizza_pequena) || 0,
            total_a_pagar: calcularTotal(req.body)
        });
        res.render('sucesso', { codigo: pedido.codigo_pedido });
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        res.status(500).send('Erro ao processar pedido');
    }
});

// Lista de pedidos
app.get('/lista', async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            order: [['data_hora', 'ASC']]
        });
        // Converter para plain objects
        const pedidosPlain = pedidos.map(p => p.get({ plain: true }));
        res.render('lista', { pedidos: pedidosPlain });
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        res.status(500).send('Erro ao buscar pedidos');
    }
});

// Cálculo de total
function calcularTotal(data) {
    const preco = {
        grande: 60,
        media: 50,
        pequena: 40,
        entrega: 10
    };

    let total = 0;
    total += (parseInt(data.qtd_pizza_grande) || 0) * preco.grande;
    total += (parseInt(data.qtd_pizza_media) || 0) * preco.media;
    total += (parseInt(data.qtd_pizza_pequena) || 0) * preco.pequena;
    if (data.tipo_entrega === 'por_motoboy') total += preco.entrega;

    return total;
}

// Inicia servidor
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});


// -- Criação da tabela pedidos
// CREATE TABLE pedidos (
//     codigo_pedido SERIAL PRIMARY KEY,
//     cliente_nome VARCHAR(40) NOT NULL,
//     cliente_endereco VARCHAR(80) NOT NULL,
//     qtd_pizzas_grandes INTEGER,
//     qtd_pizzas_medias INTEGER,
//     qtd_pizzas_pequenas INTEGER,
//     tele_entrega BOOLEAN NOT NULL,
//     total_a_pagar REAL NOT NULL,
//     data_hora TIMESTAMP DEFAULT NOW()
// );

// select * from pedidos