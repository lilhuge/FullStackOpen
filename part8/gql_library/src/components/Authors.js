import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { ALL_AUTHORS, SET_BIRTHYEAR } from "../queries"

const Authors = (props) => {
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")

  const result = useQuery(ALL_AUTHORS)
  const [setBirthyear] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (!props.show) {
    return null
  }

  const authors = result?.data?.allAuthors || []

  const onSubmitBirthyear = (event) => {
    event.preventDefault()

    setBirthyear({ variables: { name, born: Number(born) } })

    setName("")
    setBorn("")
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={onSubmitBirthyear}>
        <div>
          name{" "}
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born{" "}
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
