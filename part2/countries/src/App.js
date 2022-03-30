import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'

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