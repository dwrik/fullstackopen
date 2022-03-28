const Part = ({ name, exercises }) => {
  return <p>{name} {exercises}</p>
}

const Content = (props) => {
  return (
    <div>
      <Part name={props.part1} exercises={props.exercises1}/>
      <Part name={props.part2} exercises={props.exercises2}/>
      <Part name={props.part3} exercises={props.exercises3}/>
    </div>
  )
}

const Header = ({ course }) => {
    return <h1>{course}</h1>
}

const Total = ({ exercises1, exercises2, exercises3 }) => {
  return <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
}

const App = () => {
  const course = 'Half Stack Application Development'

  const part1 = 'Fundamentals of React'
  const part2 = 'Using props to pass data'
  const part3 = 'State of a component'

  const exercises1 = 10
  const exercises2 = 7
  const exercises3 = 14

  return (
    <div>
      <Header course={course}/>
      <Content part1={part1} part2={part2} part3={part3} exercises1={exercises1} exercises2={exercises2} exercises3={exercises3}/>
      <Total exercises1={exercises1} exercises2={exercises2} exercises3={exercises3}/>
    </div>
  )
}

export default App