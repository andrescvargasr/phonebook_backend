const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

// Use the static middleware function to serve the static build directory
app.use(express.static('build'))

// Use cors middleware to allow requests from other origins
app.use(cors())

// Created a token for morgan to log the body of a POST request
morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// app.use(morgan('tiny'))
app.use(express.json())

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const date = new Date()
  const sendMessage = `<p>Phonebook has info for ${persons.length} people</p>
  <p>${date}</p>`

  response.send(sendMessage)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// Delete person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

// Add person
const generateId = () => {
  const id = Math.floor(Math.random() * 1e6)
  return id
}

// POST request
app.post('/api/persons', (request, response) => {
  const body = request.body
  // console.log(body)

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique',
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
