const http = require('http');
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    if (req.url === '/') {
        res.writeHead(200);
        res.end('Olá, bem-vindo ao servidor Node.js sem framework!');
    } else if (req.url === '/sobre') {
        res.writeHead(200);
        res.end('Esta é uma aplicação básica feita em Node.js puro.');
    } else {
        res.writeHead(404);
        res.end('Página não encontrada.');
    }
});
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});