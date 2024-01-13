const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const baseUrl = '/api/persons'

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(morgan('tiny'))
app.use(requestLogger)
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
  response.send('<h1>This Is Not a Test</h1>')
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date().toLocaleString()}</p>`)
})

app.get(baseUrl, (request, response) => {
  response.json(persons)
})

// defining custom morgan token and content of token, omitting id by copying all but id

morgan.token('request-body', (req) => { 
  const { id, ...idOmittedBody } = req.body
  return JSON.stringify(idOmittedBody)
})

// morgan token content with standard content and custom token

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :request-body'))

//get person by id

app.get(`${baseUrl}/:id`, (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

//delete person by id

app.delete(`${baseUrl}/:id`, (request, response) => {
  const id = Number(request.params.id)
  updatePersons = persons.filter(person => person.id !== id)

  if(updatePersons.length === persons.length) {
    return response.status(404).json({error:"Not found"})
  }

  persons = updatePersons

  response.status(204).end()
})

//add person and create id

app.post(baseUrl, (request, response) => {
  const body = request.body
  
  if(body.name === "" || body.number === "") {
    response.status(400).json({error: "Name or number missing"})
  }

  duplicatePerson = persons.filter(person => person.name !== body.name)


  if(duplicatePerson.length !== persons.length) {
    response.status(400).json({error: "Name has to be unique"})
  }

  const addId = () => {
    const min = Math.ceil(1)
    const max = Math.floor(25000)
    return Math.floor(Math.random() * (max - min) + min)
  }
  body.id = addId()

  persons = persons.concat(body)

  response.status(204).end()
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})