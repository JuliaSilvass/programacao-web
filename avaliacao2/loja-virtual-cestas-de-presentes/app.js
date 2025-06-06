const express = require('express')
const app = express()
const port = 8085
const servIp = '127.0.0.1'
const path = require('path')
const { Sequelize, DataTypes } = require('sequelize')
const { engine } = require('express-handlebars');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
  helpers: {
    eq: (a, b) => a === b
  }
});

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.engine('handlebars', hbs.engine);



const sequelize = new Sequelize('loja-cestas', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432
})

sequelize.sync()
  .then(() => console.log('Conexão com o banco de dados realizada com sucesso'))
  .catch(err => console.error('Erro ao conectar com o banco de dados:', err));

const Produto = sequelize.define('Produto', {
  codigo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [0, 280]
    }
  },
  quantidade_estoque: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  categoria: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      isIn: [['Cesta', 'Item comestível', 'Bebida', 'Presente temático', 'Cartão de mensagem', 'Decoração']]
    }
  },
  foto: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'produtos',
  timestamps: false
});

const Pedido = sequelize.define('Pedido', {
  codigo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  data_pedido: {
    type: DataTypes.DATE,
    allowNull: false
  },
  nome_cliente: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  cpf_cnpj_cliente: {
    type: DataTypes.STRING(20), // CPF ou CNPJ
    allowNull: false
  },
  valor_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'pedidos',
  timestamps: false
});

//app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

const categorias = [
  'Cesta',
  'Item comestível',
  'Bebida',
  'Presente temático',
  'Cartão de mensagem',
  'Decoração'
];


app.get('/', (req, res) => {
  res.render('bemVindo');
});

// Rota para testar criação de um produto
app.get('/testar-criar-produto', async (req, res) => {
  const umProduto = {
    nome: 'Teste Produto',
    descricao: 'Descrição de teste para o produto.',
    quantidade_estoque: 10,
    preco: 50.00,
    categoria: 'Cesta',
    foto: 'teste.png'
  };

  try {
    const novoProduto = await Produto.create(umProduto);
    res.send(`Produto criado com sucesso: ${JSON.stringify(novoProduto)}`);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).send('Erro ao criar produto');
  }
});

// Rota para exibir o formulário de cadastro de produto
app.get('/produto/cadastrar', (req, res) => {
  res.render('cadastro-produto');

});


// Cadastro de produto
app.post('/produtos/cadastrar', async (req, res) => {
  try {
    const { nome, descricao, quantidade, preco, categoria, foto } = req.body;

    // Validação: não pode haver campo de dado em branco
    if (!nome || !descricao || !quantidade || !preco || !categoria || !foto) {
      return res.send('Erro: não pode haver campo de dado em branco.<br><a href="/produto/cadastrar">Voltar</a>');
    }

    await Produto.create({
      nome,
      descricao,
      quantidade_estoque: parseInt(quantidade),
      preco: parseFloat(preco),
      categoria,
      foto
    });

    res.send('Produto cadastrado com sucesso!<br><a href="/produto/cadastrar">Voltar</a>');
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao cadastrar produto.<br><a href="/produto/cadastrar">Voltar</a>');
  }
});

// Listar todos os produtos
app.get('/produtos/listar-todos', async (req, res) => {
  try {
    const produtosRaw = await Produto.findAll();
    const produtos = produtosRaw.map(prod => prod.get({ plain: true }));

    res.render('listar-todos', { produtos });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao listar produtos');
  }
});

//Consulta individual 
app.get('/produtos/:codigoProduto', async (req, res) => {
  try {
    const codigo = parseInt(req.params.codigoProduto);
    const produtoRaw = await Produto.findByPk(codigo);

    if (!produtoRaw) {
      return res.status(404).send('Produto não encontrado.<br><a href="/produtos/listar-todos">Voltar</a>');
    }

    const produto = produtoRaw.get({ plain: true });

    console.log(produto);
    res.render('consulta-produto', {
      titulo: 'Consultar Produto',
      produto,
      categorias
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao consultar produto.<br><a href="/produtos/listar-todos">Voltar</a>');
  }
});

// Rota para exibir o formulário de edição de produto
app.get('/produtos/editar/:codigoProduto', async (req, res) => {
  try {
    const codigo = parseInt(req.params.codigoProduto);
    const produtoRaw = await Produto.findByPk(codigo);

    if (!produtoRaw) {
      return res.status(404).send('Produto não encontrado.<br><a href="/produtos/listar-todos">Voltar</a>');
    }

    const produto = produtoRaw.get({ plain: true });

    res.render('editar-produto', {
      titulo: 'Editar Produto',
      produto,
      categorias
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao exibir formulário de edição.<br><a href="/produtos/listar-todos">Voltar</a>');
  }
});


// Rota para salvar a edição do produto
app.post('/produtos/salvar-edicao', async (req, res) => {
  try {
    const { codigo, nome, descricao, quantidade_estoque, preco, categoria, foto } = req.body;

    // Validação: nenhum campo pode ser vazio
    if (!codigo || !nome || !descricao || !quantidade_estoque || !preco || !categoria || !foto) {
      return res.status(400).send('Erro: Nenhum campo pode ficar em branco.<br><a href="/produtos/listar-todos">Voltar</a>');
    }

    const produto = await Produto.findByPk(codigo);

    if (!produto) {
      return res.status(404).send('Produto não encontrado.<br><a href="/produtos/listar-todos">Voltar</a>');
    }

    // Atualiza os dados
    await produto.update({
      nome,
      descricao,
      quantidade_estoque: parseInt(quantidade_estoque),
      preco: parseFloat(preco),
      categoria,
      foto
    });

    res.redirect('/produtos/listar-todos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao salvar edição.<br><a href="/produtos/listar-todos">Voltar</a>');
  }
});

// Rota para excluir um produto
app.get('/produtos/excluir/:codigoProduto', async (req, res) => {
  try {
    const codigo = parseInt(req.params.codigoProduto);
    const produto = await Produto.findByPk(codigo);

    if (!produto) {
      return res.status(404).send('Produto não encontrado.<br><a href="/produtos/listar-todos">Voltar</a>');
    }

    await produto.destroy();

    res.redirect('/produtos/listar-todos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao excluir produto.<br><a href="/produtos/listar-todos">Voltar</a>');
  }
});

// Rota para exibir os pedidos
app.get('/pedidos/listar-todos', async (req, res) => {
  try {
    const pedidosRaw = await Pedido.findAll({
      order: [['codigo', 'ASC']]
    });

    const pedidos = pedidosRaw.map(pedido => pedido.get({ plain: true }));

    res.render('listar-pedidos', { pedidos, titulo: 'Listagem de Pedidos' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao listar pedidos.');
  }
});


app.listen(port, servIp, function () {
  console.log(`\n Aplicação web executando em http://${servIp}:${port}`)
})