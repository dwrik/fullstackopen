const Header = ({ course }) => <h1>{course.name}</h1>

const Part = ({ name, exercises }) => <p>{name} {exercises}</p>

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => {
        return <Part key={part.name} name={part.name} exercises={part.exercises}/>
      })}
    </div>
  )
}

const Total = ({ parts }) => {
  const sum = parts.reduce((prev, curr) => prev + curr.exercises, 0)
  return <p><strong>total of {sum} exercises</strong></p>
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default Course