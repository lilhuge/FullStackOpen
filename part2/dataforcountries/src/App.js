import { useState, useEffect } from "react";
import axios from "axios";


const DisplayResults = ({ filteredResults }) => {
  const resultCount = filteredResults.length;
  switch (true) {
    case resultCount === 0:
      return <p>No results</p>;
    case resultCount > 10:
      return <p>Too many results, specify another filter</p>;
    case resultCount === 1:
      const result = filteredResults[0];
      console.log(result.languages);
      let languageArray = [];
      for (const language in result.languages) {
        languageArray.push(result.languages[language]);
      }
      return (
        <>
          <h2>{result.name.common}</h2>
          <p>Capital: {result.capital}</p>
          <p>Area: {result.area}</p>
          <h3>Languages:</h3>
          <ul>
            {languageArray.map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img src={result.flags.png} alt={"flag"} style={{ width: "150px" }} />
        </>
      );
    default:
      return (
        <>
          {filteredResults.map((result) => (
            <p key={result.name.common}>{result.name.common}</p>
          ))}
        </>
      );
  }
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const filterResults = (results) => {
    return results.filter((result) =>
      result.name.common.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div>
      <div>
        find countries:{" "}
        <input value={searchQuery} onChange={handleSearchChange} />
      </div>
      <div>
        <DisplayResults filteredResults={filterResults(countries)} />
      </div>
    </div>
  );
};

export default App;
