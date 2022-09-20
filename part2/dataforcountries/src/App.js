import { useState, useEffect } from "react";
import axios from "axios";

const FullCountryView = ({ country }) => {
  const { capital, languages, name, flags, area } = country;
  const [weather, setWeather] = useState({});
  // const lat = country.latlng[0];
  // const lng = country.latlng[1];
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}`
      )
      .then((response) => {
        setWeather(response.data);
      });
  }, [capital, apiKey]);

  // console.log(lat);
  // console.log(lng);
  // console.log(apiKey);

  const weatherIcon = weather?.weather?.[0]?.icon || null;
  const description = weather?.weather?.[0]?.description || null;
  const temperature = (weather?.main?.temp - 273.15).toFixed(2) || null;
  const windSpeed = weather?.wind?.speed || null;

  
  // console.log(weatherIcon);

  let languageArray = [];
  for (const language in languages) {
    languageArray.push(languages[language]);
  }
  return (
    <>
      <h2>{name.common}</h2>
      <p>Capital: {capital}</p>
      <p>Area: {area}</p>
      <h3>Languages:</h3>
      <ul>
        {languageArray.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <div>
        <img src={flags.png} alt={"flag"} style={{ width: "150px" }} />
      </div>

      {weatherIcon !== null && (
        <div>
          <h3>Weather in {capital}</h3>
          <p><strong>Temperature: </strong>{temperature} °C</p>
          <p><strong>Description: </strong>{description}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
            alt={"flag"}
            style={{ width: "150px" }}
          />
          <p><strong>Wind: </strong>{windSpeed} m/s</p>
        </div>
      )}
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
