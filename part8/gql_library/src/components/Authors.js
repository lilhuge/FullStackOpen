import React, { useState } from "react"
import Select from "react-select"
import { useQuery, useMutation } from "@apollo/client"
import { ALL_AUTHORS, SET_BIRTHYEAR } from "../queries"

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [setBirthyear] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const authors = result?.data?.allAuthors || []
  const authorOptions = authors.map((author) => {
    return { value: author.name, label: author.name }
  })
  const [name, setName] = useState(authors?.[0]?.name || "")
  const [born, setBorn] = useState("")

  const onSubmitBirthyear = (event) => {
    event.preventDefault()

    setBirthyear({ variables: { name, born: Number(born) } })

    setName("")
    setBorn("")
  }
  if (!props.show) {
    return null
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
          <Select
            options={authorOptions}
            defaultValue={name}
            onChange={(selectedOption) => setName(selectedOption.value)}
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
