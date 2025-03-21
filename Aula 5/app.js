const express = require('express');
const path = require('path');
const app = express();
const PORT = 8000;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});

app.get('/visitas', function(req,res){
    res.sendFile(path.join(__dirname, 'public', 'visitas.html'))
})

app.listen(PORT, function() {
    console.log(`Aplicação em execução em http://localhost:${PORT}/`);
});
