import { useState } from 'react'
import { Input, Button } from 'semantic-ui-react'
import './Login.css'

const Login = ({ setUserName }) => {

  const [name, setName] = useState('')
  const [isEmpty, setIsEmpty] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (name.length === 0) {
      setIsEmpty(true)
      return
    }

    localStorage.setItem('username', name)
    setUserName(name)
  }

  return (
    <form className='login-container' onSubmit={(e) => onSubmit(e)}>
      <h2>Login</h2>
      <Input
        type="text"
        placeholder="Enter name..."
        onChange={(e) => setName(e.target.value)}
        className='semantic-input'
      />
      {isEmpty && <span className='error-text'>Name cannot be empty.</span>}

      <Button
        type="submit"
        className='semantic-button'
      >Submit</Button>
    </form>
  )
}

export default Login