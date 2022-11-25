const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const userExists = users.some((user) => user.username == username);

  if (!userExists) {
    return response.status(400).json({ error: 'Mensagem do erro' })
  }

  const user = users.find(user => user.username == username)
  request.user = user
  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user)
  response.json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  response.status(201).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(), // precisa ser um uuid
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo);
  return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;