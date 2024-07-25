const http = require('http');
const {
    getTasks,
    postTask,
    putTask,
    deleteTask,
    handleNotFound,
} = require('./handlers');

const PORT = 5000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/tasks') {
        return getTasks(req, res);
    }
    if (req.method === 'POST' && req.url === '/tasks') {
        return postTask(req, res);
    }
    if (req.method === 'PUT' && req.url.startsWith('/tasks/')) {
        return putTask(req, res);
    }
    if (req.method === 'DELETE' && req.url.startsWith('/tasks/')) {
        return deleteTask(req, res);
    }
    return handleNotFound(req, res);
});

server.listen(PORT, () => {
    console.log(`Server was running in port ${PORT}`);
});
