import Country from './Country'

const Countries = ({ countries, handleShowButton }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (countries.length > 1) {
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
  } else if (countries.length === 1) {
    return <Country country={countries[0]} />
  }

  return <div>No matching country found!</div>
}

export default Countries