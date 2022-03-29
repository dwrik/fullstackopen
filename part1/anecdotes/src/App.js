import { useState } from 'react'

const Anecdote = ({ anecdote, votes }) => {
  return (
    <div>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const [selected, setSelected] = useState(0)
  const [mostPopular, setMostPopular] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const getRandomInRange = (min, max) => {
    return min + Math.floor(Math.random() * max)
  }

  const handleNext = () => {
    const newIndex = selected
    while (newIndex === selected) {
      newIndex = getRandomInRange(0, anecdotes.length)
    }
    setSelected(newIndex)
  }

  const handleVote = () => {
    const newVotes = [ ...votes ]
    newVotes[selected]++

    const newMostPopular = newVotes[selected] > newVotes[mostPopular]
        ? selected
        : mostPopular

    setVotes(newVotes)
    setMostPopular(newMostPopular)
  }

  return (
    <div>
      <h2>Anecdote of the day</h1>
      <Anecdote
        anecdote={anecdotes[selected]}
        votes={votes[selected]}
      />
      <button onClick={handleVote}>vote</button>
      <button onClick={handleNext}>next anecdote</button>

      <h2>Anecdote with most votes</h1>
      <Anecdote
        anecdote={anecdotes[mostPopular]}
        votes={votes[mostPopular]}
      />
    </div>
  )
}

export default App