import { useState, useEffect } from "react";
import axios from "axios";

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

const DisplayFilteredContacts = ({ shownPersons }) => {
  return (
    <>
      {shownPersons.map((person) => (
        <DisplayContact key={person.name} person={person} />
      ))}
    </>
  );
};

const DisplayContact = ({ person }) => {
  return (
    <p key={person.name}>
      {person.name} : {person.number}
    </p>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterText, setFilterText] = useState("");

  const handleFilterChange = (event) => setFilterText(event.target.value);
  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = { name: newName, number: newNumber };
    const names = persons.map((person) => person.name);
    const nameAlreadyInBook = names.includes(newName);
    if (nameAlreadyInBook) {
      alert(`${newName} is already added to phonebook`);
    } else {
      axios
        .post("http://localhost:3001/persons", personObject)
        .then((response) => {
          setPersons(persons.concat(response.data));
          setNewName("");
          setNewNumber("");
        });
    }
  };

  const shownPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
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
      <DisplayFilteredContacts shownPersons={shownPersons} />
    </div>
  );
};

export default App;
