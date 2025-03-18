const express = require('express')
const app = express();


//Servir arquivos estáticos na pasta 'public'
app.use(express.static('paginas_estaticas'));

//Rota para a pagina inicial
app.get('/pagina-inicial', function(req, res){
  res.sendFile(__dirname+"/paginas_estaticas/pagina-inicial.html")
}); 
app.get('/', function (req, res) {
  res.sendFile(__dirname+"/paginas_estaticas/pagina-inicial.html")
});

//Rota para a pagina de calculo-areas
app.get('/calculo-areas', function(req, res){
  res.sendFile(__dirname+"/paginas_estaticas/calculo-areas.html")
});

//rota para juros
app.get('/juros', function(req, res){
  res.sendFile(__dirname+'/paginas_estaticas/juros.html')
});

//rota para conjuntos-numericos
app.get('/conjuntos-numericos', function(req, res){
  res.sendFile(__dirname+'/paginas_estaticas/conjuntos-numericos.html')
})

//rota para fatorial
app.get('/fatorial', function(req,res){
  res.sendFile(__dirname+'/paginas_estaticas/fatorial.html')
})

app.get('/operacoes-fundamentais/:numero1/:numero2', function(req, res){
  //converte string para integer
  //se não receber um numero, o valor ficara NAN
  var num1 = parseInt(req.params.numero1)
  var num2 = parseInt(req.params.numero2)
  //cria uma variável para ir concatenando o conteúdo da pagina
  var saidaHTML = "";
  saidaHTML = saidaHTML + "<html>"
  saidaHTML = saidaHTML + " <body>"
  saidaHTML = saidaHTML + " <h2>Aprendendo Matemática Fácil</h2>"
  saidaHTML = saidaHTML + " <h3>Operações fundamentais:</h3>"
  saidaHTML = saidaHTML + " <br />numeros: " + num1 + " e " + num2 + "<br />"
  saidaHTML = saidaHTML + " <br /><b>soma:</b> " + (num1+num2)
  saidaHTML = saidaHTML + " <br /><b>subtração:</b> " + (num1-num2)
  saidaHTML = saidaHTML + " <br /><b>multiplicação:</b> " + (num1*num2)
  saidaHTML = saidaHTML + " <br /><b>divisão:</b> " + (num1/num2)
  saidaHTML = saidaHTML + " <br /><br />"
  saidaHTML = saidaHTML + " <a href='/pagina-inicial'>voltar</a>"
  saidaHTML = saidaHTML + " </body>"
  saidaHTML = saidaHTML + "</html>"
  //envia a página montada para o cliente
  res.send(saidaHTML);
  });


app.get('/tabuada_2/:numero', function(req, res){
  //converte string para integer
  //se não receber um numero, o valor ficara NAN
  var numero = parseInt(req.params.numero)
  
  var saidaHTML = "";
  saidaHTML = saidaHTML + "<html>"
  saidaHTML = saidaHTML + " <body>"
  saidaHTML = saidaHTML + " <h2>TABUADA DO " + numero + "</h2>" +"<br />"
  for(var i = 0; i <= 10; i++){
      saidaHTML = saidaHTML + "<br />" + numero + " x " + i + " = " + (numero*i)
  }
      saidaHTML = saidaHTML + " </body>"
      saidaHTML = saidaHTML + "</html>"
  res.send(saidaHTML);
});

app.get('/tabuada_5/:numero1', function(req, res){
  //converte string para integer
  //se não receber um numero, o valor ficara NAN
  var numero1 = parseInt(req.params.numero1)

  var saidaHTML = "";
  saidaHTML = saidaHTML + "<html>"
  saidaHTML = saidaHTML + " <body>"
  saidaHTML = saidaHTML + " <h2>TABUADA DO " + numero1 + "</h2>" +"<br />"
  for(var i = 0; i <= 10; i++){
      var saidaHTML = saidaHTML + "<br />" + numero1 + " x " + i + " = " + (numero1*i)
  }
  saidaHTML = saidaHTML + " </body>"
  saidaHTML = saidaHTML + "</html>"
  res.send(saidaHTML);
});


app.get('/tabuada_completa', function(req, res){
  var saidaHTML = "";

  for(var j = 1; j <= 10; j++){
      saidaHTML = saidaHTML + "<html>"
      saidaHTML = saidaHTML + " <body>"
      saidaHTML = saidaHTML + " <h2>TABUADA DO " + j + "</h2>" +"<br />"
      for(var i = 0; i <= 10; i++){
          saidaHTML = saidaHTML + "<br />" + j + " x " + i + " = " + (j*i)
      }
      saidaHTML = saidaHTML + " </body>"
      saidaHTML = saidaHTML + "</html>"
  }

  res.send(saidaHTML); 
});

app.get('/tabela', function(req, res){
  var saidaHTML = "<html>";
  saidaHTML += "<body>";
  saidaHTML += "<table border='1'>";

  saidaHTML += "<tr>";
  for(var i = 1; i <= 20; i++){
      saidaHTML += "<td>" + i*10 + "</td>";
      if (i % 5 == 0) {
          saidaHTML += "</tr>";
      }
  }
  saidaHTML += "</tr>";

  saidaHTML += "</table>";
  saidaHTML += "</body>";
  saidaHTML += "</html>";

  res.send(saidaHTML);
})

app.get('/frase/:qtdRepeticoes', function(req, res){

  //converte string para integer
  //se não receber um numero, o valor ficara NAN
  var qtdRepeticoes = parseInt(req.params.qtdRepeticoes)
  var saidaHTML = "";

  for(var i = 0; i <= qtdRepeticoes; i++){
      saidaHTML = saidaHTML + "<html>"
      saidaHTML = saidaHTML + " <body>"
      if (i % 5 == 0) {
        saidaHTML = saidaHTML + "<span style ='color:red;'> " + i + " " + "Brasil</span>" + "<br></br>"
      } else {
        saidaHTML = saidaHTML + i + " " + "brasil" + "<br></br>"
      }
      saidaHTML = saidaHTML + " </body>"
      saidaHTML = saidaHTML + "</html>"
  }
  res.send(saidaHTML);
});

app.get('/tabela_zebrada', function(req, res){
  var saidaHTML = "<html>";
  saidaHTML += "<body>";
  saidaHTML += "<table border='1'>";
  saidaHTML += "<tr bgcolor='#00FF00'><><th>Parte 1</th><th>Parte 2</th><th>Parte 3</th></tr>"

  saidaHTML += "<tr>"
  for(var i = 1; i <= 15; i++){
    var corlinha = Math.floor((i-1)/3 ) % 2 === 0 ? "#F0F0F0" : "#FFFFFF";
    
    if (i % 3 === 1) {
      saidaHTML += "<tr bgcolor='" + corlinha + "'>";
    }
    saidaHTML += "<td>" + i*10 + "</td>";

    if (i % 3 === 0) {
      saidaHTML += "</tr>";
    }
  }
  
  if (50 % 3 !== 0) {
    saidaHTML += "</tr>";
  }

  saidaHTML += "</table>";
  saidaHTML += "</body>";
  saidaHTML += "</html>";

  res.send(saidaHTML);
})

app.listen(3000, () => {
  console.log('Aplicação em execução em http://localhost:3000/');
});
