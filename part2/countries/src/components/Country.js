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

export default Country