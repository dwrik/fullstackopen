import { useState } from 'react'

const Button = ({ handler, text }) =>
    <button onClick={handler}>{text}</button>

const Feedback = ({ badHandler, goodHandler, neutralHandler }) => {
  return (
    <div>
      <h1>give feedback</h1>
      <Button handler={goodHandler} text="good"/>
      <Button handler={neutralHandler} text="neutral"/>
      <Button handler={badHandler} text="bad"/>
    </div>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, bad, neutral }) => {
  const total = good + bad + neutral
  const average = (good - bad) / total
  const positive = (good / total) * 100

  return (
    <div>
      <h1>statistics</h1>
      {total === 0
        ? <div>No feedback given</div>
        : <table>
            <tbody>
              <StatisticLine text="good" value={good}/>
              <StatisticLine text="neutral" value={neutral}/>
              <StatisticLine text="bad" value={bad}/>
              <StatisticLine text="all" value={total}/>
              <StatisticLine text="average" value={average}/>
              <StatisticLine text="positive" value={positive + " %"}/>
            </tbody>
          </table>
      }
    </div>
  )
}

const App = () => {
  const [bad, setBad] = useState(0)
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)

  const handleBad = () => setBad(bad + 1)
  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)

  return (
    <div>
      <Feedback
        badHandler={handleBad}
        goodHandler={handleGood}
        neutralHandler={handleNeutral}
      />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App