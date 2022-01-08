import React, { useState, useEffect } from 'react'
import personServices from './services/persons'
import Person from './components/Person'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'


const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ filteredPersons, setFilteredPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newSearch, setNewSearch ] = useState(' ')
  const [ message, setMessage ] = useState(null)

  const notif = (notif, type) => {
    setMessage({notif, type})
    setTimeout(() => setMessage(null), 3000)
  }

  useEffect(() => {
                  personServices
                  .getAll()
                  .then(retrievedPersons => setPersons(retrievedPersons)) }
                  , [])

  const addName = (event) => {
    event.preventDefault()
    const personToBeAdded = { name: newName, number: newNumber }
    const personIsPresent = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
    if (personIsPresent !== undefined) { 
      if (window.confirm(`${newName} has already been added to phonebook, replace the old number with a new one?`)) {
        personServices.updateEntry(personIsPresent.id, personToBeAdded)
                      .then(updatedPerson => {
                        notif(`${updatedPerson.name}'s number has been updated`, 'success')
                        setPersons(persons.map(person => person.name.toLowerCase() !== newName.toLowerCase() ? person : updatedPerson))
                        setNewName('')
                        setNewNumber('')
                        })
                      .catch(error => {
                        console.log(error.response.data)
                        notif(error.response.data.error, 'error')
                      })
      }
    }
    else {
      personServices.createEntry(personToBeAdded)
                    .then(newPerson => {
                      notif(`${newPerson.name} has been added`, 'success')
                      setPersons(persons.concat(newPerson))
                      setNewName('')
                      setNewNumber('')
                    })
                    .catch(error => {
                      console.log(error.response.data)
                      notif(error.response.data.error, 'error')
                    })
    }
  }

  const deleteRecord = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      const personsRemaining = persons.filter(person => person.id !== id)
      personServices.deleteEntry(id)
                    .then(() => setPersons(personsRemaining))
                    .catch(error => {
                      notif(`Information of ${name} has already been removed from server`, 'error')
                    })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
    if (event.target.value === '') setFilteredPersons([])
    else setFilteredPersons(persons.filter(person => person.name.toLowerCase().match(newSearch.toLowerCase())))
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter value={newSearch} handleSearchChange={handleSearchChange} filteredPersons={filteredPersons} />
      <h2>add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber} addName={addName} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <ul>
          {persons.map(person => <Person key={person.name} person={person} deleteRecord={() => deleteRecord(person.id, person.name)} />)}
      </ul>
    </div>
  )
}

export default App;
