import axios from 'axios'

const baseUrl = '/api/persons'

// function for mounting and refreshing data, mapping MondoDB _id to person object id
const fetchData = (setPersons) => {
  fetch('/api/persons')
    .then(response => response.json())
    .then(data => {
      const personsWithId = data.map(person => {
        console.log(person._id); // Log _id to the terminal
        return {
          ...person,
          id: person._id
        }
      })
      setPersons(personsWithId)
    })

// function for verifying that person not already added, to add person, and new number for existing person
const addPerson = (newName, newNumber, persons, setPersons, setNewName, setNewNumber, setAddSuccessful) => {
  event.preventDefault()

  const personObject = {
    name: newName,
    number: newNumber,
  }

  const arrayIndex = persons.findIndex(
    (person) => person.name.toLowerCase() === newName.toLowerCase()
  )

  if (arrayIndex !== -1) {
    // Person already exists, prompt for confirmation to update
    if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
      const existingPerson = persons[arrayIndex]
      const updatedPersonObject = { ...existingPerson, number: newNumber }

      // Update person if id exists
      if (updatedPersonObject.id) {
        serverCommunication
          .updatePerson(updatedPersonObject.id, updatedPersonObject)
          .then((response) => {
            // Update person in the frontend list
            setPersons(
              persons.map((person) =>
                person.id !== updatedPersonObject.id ? person : updatedPersonObject
              )
            )
            setAddSuccessful(`Updated ${newName}'s number`)
            setTimeout(() => {
              setAddSuccessful(null)
            }, 3000)
          })
          .catch((error) => {
            setAddSuccessful(`Failed to update ${newName}`)
            setTimeout(() => {
              setAddSuccessful(null)
            }, 3000)
          })
      }
    }
  } else {
    // Person doesn't exist, add new person
    serverCommunication
      .addPerson(newName, newNumber)
      .then((newPerson) => {
        // Add the new person to the list
        setPersons(persons.concat(newPerson))
        setAddSuccessful(`Added ${newName}`)
        setTimeout(() => {
          setAddSuccessful(null)
        }, 3000)
      })
      .catch((error) => {
        setAddSuccessful(`Failed to add ${newName}`)
        setTimeout(() => {
          setAddSuccessful(null)
        }, 3000)
      })
  }

  // Reset form fields
  setNewName('')
  setNewNumber('')
}

  // function to delete person with Delete- button
  
  const deletePerson = (id, name, setPersons, setDeleteSuccessful) => {
    if (!id) {
      setDeleteSuccessful(`Error: No ID found for ${name}`);
      return;
    }
  
    if (window.confirm(`Delete ${name}?`)) {
      fetch(`/api/persons/${id}`, { method: 'DELETE' })
        .then(response => {
          if (response.ok) {
            setPersons(prevPersons => prevPersons.filter(person => person.id !== id))
            setDeleteSuccessful(`Deleted ${name}`)
          } else {
            setDeleteSuccessful(`Failed to delete ${name}.`)
          }
        })
        .catch(error => {
          setDeleteSuccessful(`Error deleting ${name}: ${error.message}`)
        })
    }
  }

  export default {fetchData, addPerson, deletePerson}