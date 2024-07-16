const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

let tasks = [];

function getTasks(req, res) {
    fs.readFile('fileWithArray.txt', (err, data) => {
        if (err) {
            console.log(err);
        }
        if (data) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
        }
    });
}

function postTask(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    let taskJson = '';
    if (req.headers['content-type'] === 'application/json') {
        req.on('data', (chunk) => (taskJson += chunk));
        req.on('end', () => {
            try {
                const task = JSON.parse(taskJson);
                tasks.push({ id: uuidv4(), ...task });
                fs.writeFile(
                    'fileWithArray.txt',
                    JSON.stringify(tasks),
                    'utf-8',
                    (err) => {
                        if (err) console.log(err);
                    }
                );
                res.statusCode = 200;
                res.end('Task created');
            } catch (error) {
                res.statusCode = 400;
                res.end('Invalid Json', error);
            }
        });
    }
}

function putTask(req, res) {
    const id = req.url.split('/')[2];
    const task = tasks.find((el) => {
        return el.id === id;
    });
    let taskJson = '';
    if (task) {
        if (req.headers['content-type'] === 'application/json') {
            req.on('data', (chunk) => (taskJson += chunk));
            req.on('end', () => {
                try {
                    const { taskName, descript } = JSON.parse(taskJson);
                    task.taskName = taskName;
                    task.descript = descript;
                    res.statusCode = 200;
                    res.end('Task was changed');
                } catch (error) {
                    res.statusCode = 400;
                    res.end('Invalid Json');
                }
            });
        }
    } else {
        res.statusCode = 400;
        res.end('Not found this task');
    }
}

function deleteTask(req, res) {
    const id = req.url.split('/')[2];
    tasks = tasks.filter((t) => t.id !== id);
    res.statusCode = 204;
    res.end('Element was deleted');
}

function handleNotFound(req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Page not found. Code: 404</h1>');
}

module.exports = {
    getTasks,
    postTask,
    putTask,
    deleteTask,
    handleNotFound,
};
