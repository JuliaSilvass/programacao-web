const express = require('express')
const app = express()
const port = 8085
const servIp = '127.0.0.1'
const path = require('path')
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('lojaCesta', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432
})

const categoria = ['Item comestível', 'Bebida', 'Presente temático', 'Cartão de mensagem', 'Decoração']

const Produto = sequelize.define('produtos', {
    codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.STRING, allowNull: false },
    quantidade: { type: DataTypes.INTEGER, allowNull: false },
    preco: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    categoria: {
        type: DataTypes.ENUM(...categoria),
        allowNull: false
    },
    tipo: { type: DataTypes.ENUM('produto', 'cesta'), allowNull: false, defaultValue: 'produto' },
    capacidade_maxima_litros: { type: DataTypes.FLOAT, allowNull: true },
    material: { type: DataTypes.STRING, allowNull: true }
}, {
    tableName: 'produtos',
    timestamps: false
})

sequelize.sync()
  .then(() => console.log('Banco sincronizado'))
  .catch(err => console.error('Erro ao sincronizar banco:', err));


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'cadastroProduto.html'))
})

// Cadastro de produto
app.post('/produto/cadastrar', async (req, res) => {
  try {
    const { nome, descricao, quantidade, preco, categoria, tipo, capacidade_maxima_litros, material } = req.body;

    // Validação simples dos campos obrigatórios
    if (!nome || !descricao || !quantidade || !preco || !categoria) {
      return res.status(400).send('Erro: Preencha todos os campos obrigatórios.<br><a href="/">Voltar</a>');
    }

    // Se for cesta, valida campos extras
    if (tipo === 'cesta') {
      if (!capacidade_maxima_litros || !material) {
        return res.status(400).send('Erro: Para cesta, capacidade máxima e material são obrigatórios.<br><a href="/">Voltar</a>');
      }
    }

    await Produto.create({
      nome,
      descricao,
      quantidade: parseInt(quantidade),
      preco: parseFloat(preco),
      categoria,
      tipo: tipo || 'produto',
      capacidade_maxima_litros: tipo === 'cesta' ? parseFloat(capacidade_maxima_litros) : null,
      material: tipo === 'cesta' ? material : null
    });

    res.send('Produto cadastrado com sucesso!<br><a href="/">Voltar</a>');

  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao cadastrar produto.<br><a href="/">Voltar</a>');
  }
});

// Listagem de produtos
app.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.findAll();
    let html = '<h1>Lista de Produtos</h1>';
    html += '<table border="1"><tr><th>Código</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Ações</th></tr>';

    produtos.forEach(prod => {
      html += `<tr>
                <td>${prod.codigo}</td>
                <td>${prod.nome}</td>
                <td>${prod.categoria}</td>
                <td>R$ ${parseFloat(prod.preco).toFixed(2)}</td>
                <td>
                  <a href="/produto/${prod.codigo}">Ver</a> |
                  <a href="/produto/${prod.codigo}/editar">Editar</a> |
                  <form action="/produto/${prod.codigo}/excluir" method="POST" style="display:inline;">
                    <button type="submit">Excluir</button>
                  </form>
                </td>
              </tr>`;
    });

    html += '</table>';
    html += '<br><a href="/">Cadastrar novo produto</a>';

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao listar produtos');
  }
});

//Consulta individual 
app.get('/produto/:codigo', async (req, res) => {
  try {
    const codigo = parseInt(req.params.codigo);
    const produto = await Produto.findByPk(codigo);

    if (!produto) {
      return res.status(404).send('Produto não encontrado.<br><a href="/produtos">Voltar</a>');
    }

    let html = `
      <h1>Detalhes do Produto</h1>
      <p><strong>Código:</strong> ${produto.codigo}</p>
      <p><strong>Nome:</strong> ${produto.nome}</p>
      <p><strong>Descrição:</strong> ${produto.descricao}</p>
      <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
      <p><strong>Preço:</strong> R$ ${parseFloat(produto.preco).toFixed(2)}</p>
      <p><strong>Categoria:</strong> ${produto.categoria}</p>
      <p><strong>Tipo:</strong> ${produto.tipo}</p>`;

    if (produto.tipo === 'cesta') {
      html += `
        <p><strong>Capacidade Máxima (L):</strong> ${produto.capacidade_maxima_litros}</p>
        <p><strong>Material:</strong> ${produto.material}</p>`;
    }

    html += `<br><a href="/produtos">Voltar para lista</a>`;

    res.send(html);

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao consultar produto.<br><a href="/produtos">Voltar</a>');
  }
});

app.get('/produto/:codigo/editar', async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.codigo);

    if (!produto) {
      return res.status(404).send('Produto não encontrado.<br><a href="/produtos">Voltar</a>');
    }

    let html = `
      <h1>Editar Produto</h1>
      <form action="/produto/${produto.codigo}/editar" method="POST">
        <label>Nome: <input type="text" name="nome" value="${produto.nome}" required></label><br>
        <label>Descrição: <input type="text" name="descricao" value="${produto.descricao}" required></label><br>
        <label>Quantidade: <input type="number" name="quantidade" value="${produto.quantidade}" required></label><br>
        <label>Preço: <input type="number" step="0.01" name="preco" value="${produto.preco}" required></label><br>
        <label>Categoria:
          <select name="categoria" required>
            ${categoria.map(cat => `<option value="${cat}" ${produto.categoria === cat ? 'selected' : ''}>${cat}</option>`).join('')}
          </select>
        </label><br>
        <label>Tipo:
          <select name="tipo" required>
            <option value="produto" ${produto.tipo === 'produto' ? 'selected' : ''}>Produto</option>
            <option value="cesta" ${produto.tipo === 'cesta' ? 'selected' : ''}>Cesta</option>
          </select>
        </label><br>
        <label>Capacidade Máxima (Litros): <input type="number" step="0.01" name="capacidade_maxima_litros" value="${produto.capacidade_maxima_litros || ''}"></label><br>
        <label>Material: <input type="text" name="material" value="${produto.material || ''}"></label><br>
        <button type="submit">Salvar</button>
      </form>
      <br><a href="/produtos">Voltar</a>
    `;

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao exibir formulário de edição.<br><a href="/produtos">Voltar</a>');
  }
});


app.post('/produto/:codigo/editar', async (req, res) => {
  try {
    const { nome, descricao, quantidade, preco, categoria, tipo, capacidade_maxima_litros, material } = req.body;

    if (!nome || !descricao || !quantidade || !preco || !categoria) {
      return res.status(400).send('Erro: Preencha todos os campos obrigatórios.<br><a href="/produtos">Voltar</a>');
    }

    const produto = await Produto.findByPk(req.params.codigo);
    if (!produto) {
      return res.status(404).send('Produto não encontrado.<br><a href="/produtos">Voltar</a>');
    }

    await produto.update({
      nome,
      descricao,
      quantidade: parseInt(quantidade),
      preco: parseFloat(preco),
      categoria,
      tipo: tipo || 'produto',
      capacidade_maxima_litros: tipo === 'cesta' ? parseFloat(capacidade_maxima_litros) : null,
      material: tipo === 'cesta' ? material : null
    });

    res.send('Produto atualizado com sucesso!<br><a href="/produtos">Voltar</a>');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao atualizar produto.<br><a href="/produtos">Voltar</a>');
  }
});

app.post('/produto/:codigo/excluir', async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.codigo);

    if (!produto) {
      return res.status(404).send('Produto não encontrado.<br><a href="/produtos">Voltar</a>');
    }

    await produto.destroy();

    res.send('Produto excluído com sucesso!<br><a href="/produtos">Voltar</a>');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao excluir produto.<br><a href="/produtos">Voltar</a>');
  }
});





app.listen(port, servIp, function () {
    console.log(`\n Aplicação web executando em http://${servIp}:${port}`)
})