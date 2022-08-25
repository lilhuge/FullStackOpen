import { useState, useEffect } from "react";
import axios from "axios";

const FullCountryView = ({ country }) => {
  let languageArray = [];
  for (const language in country.languages) {
    languageArray.push(country.languages[language]);
  }
  return (
    <>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {languageArray.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={"flag"} style={{ width: "150px" }} />
    </>
  );
};

const SearchResultItem = ({ result, handleShowClick }) => {
  return (
    <div key={result.name.common}>
      {result.name.common}
      <button onClick={handleShowClick(result.name.common)}>show</button>
    </div>
  );
};

const DisplayResults = ({ filteredResults, handleShowClick }) => {
  const resultCount = filteredResults.length;
  switch (true) {
    case resultCount === 0:
      return <p>No results</p>;
    case resultCount > 10:
      return <p>Too many results, specify another filter</p>;
    case resultCount === 1:
      const result = filteredResults[0];
      return <FullCountryView country={result} />;
    default:
      return (
        <>
          {filteredResults.map((result) => (
            <SearchResultItem
              key={result.name.common}
              result={result}
              handleShowClick={handleShowClick}
            />
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
  const handleShowClick = (country) => () => {
    setSearchQuery(country);
  };

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
        <DisplayResults
          filteredResults={filterResults(countries)}
          handleShowClick={handleShowClick}
        />
      </div>
    </div>
  );
};

export default App;
