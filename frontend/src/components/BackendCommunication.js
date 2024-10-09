import axios from 'axios'

// component for mounting and refreshing data 
const fetchData = (setPersons) => {
  axios
    .get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data);
    })
}

// component for verifying that person not already added and add person
const addPerson = (newName, newNumber, persons, setPersons, setNewName, setNewNumber) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
  
    if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
      console.log(`${newName} is already added to phonebook`)
    } else {
      axios
        .post('http://localhost:3001/persons', personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
        })
    }
  
    setNewName('')
    setNewNumber('')
  }

  export default {fetchData, addPerson}