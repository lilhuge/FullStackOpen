import { useState, useEffect } from "react";
import phonebookService from "./services/phonebook.js";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  if (message.includes("Warning:"))
    return <div className="warning">{message}</div>;

  return <div className="notification">{message}</div>;
};

const Filter = ({ filterText, handleFilterChange }) => {
  return (
    <div>
      filter shown with{" "}
      <input value={filterText} onChange={handleFilterChange} />
    </div>
  );
};

const NewContactForm = ({
  addPerson,
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const DisplayFilteredContacts = ({ shownPersons, handleDeletePerson }) => {
  return (
    <>
      {shownPersons.map((person) => (
        <DisplayContact
          key={person.name}
          person={person}
          handleDeletePerson={handleDeletePerson}
        />
      ))}
    </>
  );
};

const DisplayContact = ({ person, handleDeletePerson }) => {
  return (
    <p key={person.name}>
      {person.name} : {person.number}{" "}
      <button onClick={() => handleDeletePerson(person.id, person.name)}>
        Delete
      </button>
    </p>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterText, setFilterText] = useState("");
  const [message, setMessage] = useState(null);

  const handleFilterChange = (event) => setFilterText(event.target.value);
  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);

  const fetchData = () => {
    phonebookService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  };

  const addPerson = (event) => {
    event.preventDefault();
    const newPersonObject = { name: newName, number: newNumber };
    const matchingPersons = persons.filter((person) => person.name === newName);
    const nameAlreadyInBook = matchingPersons.length > 0;
    console.log(matchingPersons);
    if (nameAlreadyInBook) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        console.log(matchingPersons[0]);
        phonebookService
          .update(matchingPersons[0].id, newPersonObject)
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === matchingPersons[0].id ? updatedPerson : person
              )
            );
            setNewName("");
            setNewNumber("");
            setMessage(`Updated details for ${newPersonObject.name}`);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          });
      }
    } else {
      phonebookService.create(newPersonObject).then((newPerson) => {
        setPersons(persons.concat(newPerson));
        setNewName("");
        setNewNumber("");
        setMessage(`Added ${newPersonObject.name}`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
    }
  };

  const shownPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleDeletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      let newPersonsArray = persons.filter((person) => person.id !== id);
      phonebookService.deletePerson(id).catch((error) => {
        setMessage(
          `Warning: The contact '${name}' was already deleted from server`
        );
      });
      setPersons(newPersonsArray);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filterText={filterText} handleFilterChange={handleFilterChange} />
      <h2>Add new contact</h2>
      <NewContactForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <DisplayFilteredContacts
        shownPersons={shownPersons}
        handleDeletePerson={handleDeletePerson}
      />
    </div>
  );
};

export default App;
