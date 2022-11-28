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
    return response.status(400).json({ error: 'Usuário nao existe.' })
  }

  const user = users.find(user => user.username == username)
  request.user = user
  return next();
}

app.get('/users', (request, response) => {
  return response.json(users)
})

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userExists = users.some((user) => user.username == username);

  if (userExists) {
    return response.status(400).json({ error: 'username already exists.' })
  }

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
  return response.status(200).json(user.todos)
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
  const { title, deadline } = request.body;
  const { id } = request.params
  const { user } = request
  const todoExists = user.todos.some(todo => todo.id == id)

  if (!todoExists) {
    return response.status(404).json({ error: 'todo não existe.' })
  }

  const todo = user.todos.find(todo => todo.id === id)
  todo.title = title;
  todo.deadline = new Date(deadline)
  return response.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params
  const { user } = request

  const todoExists = user.todos.some((todo) => todo.id == id);

  if (!todoExists) {
    return response.status(404).json({ error: 'Todo não existe.' })
  }

  const todo = user.todos.find((todo) => todo.id == id)
  todo.done = true

  return response.json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { id } = request.params

  const todoExists = user.todos.some((todo) => todo.id == id);

  if (!todoExists) {
    return response.status(404).json({ error: 'Todo não existe.' })
  }

  const todoIndex = user.todos.findIndex(
    todo => todo.id === id);

  user.todos.splice(todoIndex, 1);

  return response.status(204).send()

});

module.exports = app;