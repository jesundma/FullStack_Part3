const express = require('express')
const app = express()
const cors = require('cors')
const baseUrl = 'http://localhost:3000/api/persons'

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  },

  { 
    "id": 6,
    "name": "Pumber Poppendieck", 
    "number": "40-23-6423122"
  },
  { 
    "id": 88,
    "name": "Bomber Poppendick", 
    "number": "40-23-6423122"
  }

]

app.get('/', (request, response) => {
  response.send('<h1>Hello Test Nodemon World!</h1>')
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date().toLocaleString()}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

//get person by id

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

//delete person by id

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  console.log(persons[id])

  response.status(204).end()
})

//add person and create id

app.post(baseUrl, (request, response) => {
  const body = request.body
  const addId = () => {
    min = Math.ceil(1)
    max = Math.floor(25000)
    return Math.floor(Math.random() * (max - min) + min)
  }
  body.id = addId()

  response.status(204).end()
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})