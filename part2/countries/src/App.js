import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)

  const capital = country.capital[0]
  const api_key = process.env.REACT_APP_API_KEY
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`

  const { name, area, languages, flags } = country
  const temperature = weather ? weather.main.temp : 'N/A'
  const wind = weather ? weather.wind.speed : 'N/A'
  const icon = weather ? weather.weather[0].icon : ''

  useEffect(() => {
    axios
      .get(url)
      .then(response => setWeather(response.data))
  }, [url])

  return (
    <div>
      <h2>{name.common}</h2>
      <div>capital {capital}</div>
      <div>area {area}</div>
      <h4>languages</h4>
      <ul>
        {Object.keys(languages).map(lang => {
          return <li key={lang}>{languages[lang]}</li>
        })}
      </ul>
      <img
        width="200px"
        height="auto"
        src={flags.png}
        alt="national-flag"
      />
      <h2>Weather in {capital}</h2>
      <div>temperature {temperature} &#8451;</div>
      <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt='weather-icon' />
      <div>wind {wind} m/s</div>
    </div>
  )
}

const Countries = ({ countries, handleShowButton }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  if (countries.length > 1) {
    return (
      <div>
        {countries.map(country => {
          return <div key={country.name.common}>
            <span>{country.name.common}</span>
            <button onClick={handleShowButton}>show</button>
          </div>
        })}
      </div>
    )
  }

  if (countries.length === 1) {
    return <Country country={countries[0]} />
  }

  return <div>No matching country found!</div>
}

const App = () => {
  const [country, setCountry] = useState('')
  const [countries, setCountries] = useState([])

  const handleCountryChange = (event) => setCountry(event.target.value.toLowerCase())
  const handleShowButton = (event) => setCountry(event.target.previousSibling.innerText.toLowerCase())

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then(response => setCountries(response.data))
  }, [])

  const countriesToShow = country === ''
    ? []
    : countries.filter(({ name }) => name.common.toLowerCase().includes(country))

  return (
    <div>
      <div>
        find countries
        <input value={country} onChange={handleCountryChange} />
      </div>
      <div>
        <Countries
          countries={countriesToShow}
          handleShowButton={handleShowButton}
        />
      </div>
    </div>
  )
}

export default App