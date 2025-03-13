import express, { response } from 'express';
import moment from 'moment';
import { parseArgs } from 'util';

const app = express();

app.get('/local', function (request, response) {
  response.send('IFSUL <u>Campus Bagé </u>');
});

// Rota que calcula o dobro
app.get('/dobro/:numero', function (request, response) {
  var numero = parseInt(request.params.numero);
  var dobro = numero * 2;
  response.send(`O dobro do número ${numero} é ${dobro}`);
});

//Calcula a media de duas notas via URL
app.get('/media/:num1/:num2', function (request, response) {
  var num1 = parseInt(request.params.num1);
  var num2 = parseInt(request.params.num2);
  var result = (num1 + num2) / 2;

  response.send(`O resultado da média é: ${result}`);
});

//Rota com data e horario atual
app.get('/horario', function (request, response) {
  const dataAtual = moment().format('YYYY-MM-DD');
  const horario = moment().format('HH:mm');

  response.send(`O horário é: ${horario} e a data é: ${dataAtual}`);
});

//Rota pra nome e sobrenome via url
app.get("/nome/:name/:lastname", function (request, response){
  var name = String(request.params.name);
  var lastname = String(request.params.lastname);

    response.send(`Nome: ${name}, Sobrenome: ${lastname}`)
});

//retorna a área do retângulo
app.get("/retangulo/:base/:altura", function (request, resonse){
  var base = parseInt(request.params.base);
  var altura = parseInt(request.params.altura);

  var result = base * altura 

  response.send(`A área do retângulo é: ${result}`)
});

//retorna a área do ciruclo
app.get("/circulo/:raio", function(request, response){
    var raio = parseInt(request.params.raio)
    response.send(`A área do ciruclo é: ${raio * Math.PI}`)
})

// retorna a área do triângulo 
app.get("/triangulo/:base/:altura", function(request, response){
    var base = parseInt(request.params.base)
    var altura = parseInt(request.params.altura)

    response.send(`A área do triângulo é: ${(base * altura)/2}`)
})

app.listen(3000, () => {
  console.log('Aplicação em execução em http://localhost:3000/');
});
