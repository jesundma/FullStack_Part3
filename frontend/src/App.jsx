import { useState, useEffect } from 'react'
import axios from 'axios'
const baseURL = '/api/persons'

// Form for adding and deleting persons
const Form = ({ newName, newNumber, handleNameAddition, handleNumberAddition, addName }) => {
  return (
    <form onSubmit={addName}>
      <div>Name: <input value={newName} onChange={handleNameAddition} /></div>
      <div>Number: <input value={newNumber} onChange={handleNumberAddition} /></div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  )
}

// Notification component for showing success or error messages
const Notification = ({ message, type }) => {
  const addMessageStyle = {
    color: type === 'success' ? 'green' : 'red',
    fontSize: 20,
    backgroundColor: 'lightgrey',
    border: type === 'success' ? '2px solid green' : '2px solid red',
    padding: '10px'
  }

  if (!message) return null

  return (
    <div style={addMessageStyle}>
      <p>{message}</p>
    </div>
  )
}

// Fetch data from API
const fetchData = (setPersons) => {
  axios
    .get(baseURL)
    .then(response => setPersons(response.data))
}

// Adding and updating persons
const AddName = (persons, setPersons, newName, newNumber, setNewName, setNewNumber, setAddSuccessful, setMessageType, setNotificationMessage) => (event) => {
  event.preventDefault()
  const personObject = { name: newName, number: newNumber }
  
  const indexForPerson = persons.findIndex((p) => p.name === personObject.name)

  if (indexForPerson !== -1) {
    if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      axios
        .put(`${baseURL}/${persons[indexForPerson].id}`, personObject)
        .then(() => {
          fetchData(setPersons)
          setAddSuccessful(true)
          setMessageType('success')
          setNotificationMessage(`Updated ${newName}`)
        })
        .catch(error => {
          setMessageType('error')
          setNotificationMessage(error.response.data.error)
        })  
    }
  } else {
    axios
      .post(`${baseURL}`, personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setAddSuccessful(true)
        setMessageType('success')
        setNotificationMessage(`added ${newName}`)
      })
      .catch(error => {
        setMessageType('error')
        setNotificationMessage(error.response.data.error)
      })
  }

  setNewName('')
  setNewNumber('')
}

// Deleting persons
const DeleteName = (id, name, statePersons, setDeleteSuccessful) => {
  if (window.confirm(`${name} delete`)) {
    axios
      .delete(`${baseURL}/${id}`)
      .then(() => {
        fetchData(statePersons)
        setDeleteSuccessful(true)
        setMessageType('success')
        setNotificationMessage(`Deleted ${name}`)
      })
      .catch(() => {
        setDeleteSuccessful(false)
        setMessageType('error')
        setNotificationMessage('Delete failed')
      })
  }
}

// Filter persons
const FilterData = (persons, filter) => persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

// Presenting filtered persons
const PresentData = ({ persons, filter, statePersons, setDeleteSuccessful }) => {
  try {
    const personsFiltered = FilterData(persons, filter)

    return (
      <ul>
        {personsFiltered.map(person => (
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => DeleteName(person.id, person.name, statePersons, setDeleteSuccessful)}>Delete</button>
          </li>
        ))}
      </ul>
    )
  } catch (err) {
    console.error(err)
    return null
  }
};

const App = () => {
  // States
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState('')
  const [addSuccessful, setAddSuccessful] = useState(null)
  const [deleteSuccessful, setDeleteSuccessful] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  // Fetch data when component mounts
  useEffect(() => {
    fetchData(setPersons)
  }, [])

// Success message after adding a person
  useEffect(() => {
    if (addSuccessful === true) { 
      const timerForInfo = setTimeout(() => {
        setMessageType(null)
        setNotificationMessage(null)
        setAddSuccessful(null)
        setNewName('')
        setNewNumber('')
      }, 2000)

      return () => clearTimeout(timerForInfo)
    }
  }, [addSuccessful])

  // Error message after failed delete
  useEffect(() => {
    if (deleteSuccessful === false) {
      const timerForInfo = setTimeout(() => {
        setMessageType(null)
        setNotificationMessage(null)
        setDeleteSuccessful(null)
        setNewName('')
        setNewNumber('')
      }, 2000)

      return () => clearTimeout(timerForInfo)
    }
  }, [deleteSuccessful])

  // Error message for error in validation

  useEffect(() => {
    if (messageType === 'error') {
      const timer = setTimeout(() => {
        setMessageType(null)
        setNotificationMessage(null)
      }, 2000)
  
      return () => clearTimeout(timer)
    }
  }, [messageType])

  // Event handlers
  const handleNameAddition = (event) => setNewName(event.target.value)
  const handleNumberAddition = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setShowAll(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={messageType} />
      <div>Filter shown with: <input value={showAll} onChange={handleFilterChange} /></div>
      <h3>Add a new</h3>
      <Form
        newName={newName}
        newNumber={newNumber}
        handleNameAddition={handleNameAddition}
        handleNumberAddition={handleNumberAddition}
        addName={AddName(persons, setPersons, newName, newNumber, setNewName, setNewNumber, setAddSuccessful, setMessageType, setNotificationMessage)}
      />
      <h2>Numbers</h2>
      <PresentData persons={persons} filter={showAll} statePersons={setPersons} setDeleteSuccessful={setDeleteSuccessful} />
    </div>
  )
}

export default App