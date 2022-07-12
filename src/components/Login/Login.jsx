import { useState } from 'react'
import { Input, Button } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const Login = ({ setUserName, setExistingUser }) => {

  const [email, setEmail] = useState('')
  const [isEmpty, setIsEmpty] = useState(false)
  const [isConnection, setIsConnection] = useState(true)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()

  const onSubmit = async (e) => {
    if (localStorage.getItem('user')) {
      navigate('/home')
    }
    e.preventDefault()
    if (email.length === 0) {
      setIsEmpty(true)
      return
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      })

      const result = await response.json()
      if (response.status === 400) {
        setErrorMessage(result.message)
        setIsError(true)
      }
      if (response.status === 200) {
        localStorage.setItem('user', email)
        localStorage.setItem('userID', result.body.id)
        setExistingUser(true)
        navigate('/home')
      }

    } catch (ex) {
      setIsConnection(false)
    }
  }

  return (
    <form className='login-container' onSubmit={(e) => onSubmit(e)}>
      {isConnection &&
        <>
          <h2>Login</h2>
          <Input
            type="email"
            placeholder="Enter email..."
            onChange={(e) => setEmail(e.target.value)}
            className='semantic-input'
          />
          {isEmpty && <span className='error-text'>Email cannot be empty.</span>}
          {isError && <span className='error-text'>{errorMessage}</span>}

          <Button
            type="submit"
            className='semantic-button'
          >Submit</Button>
        </>

      }
      {!isConnection && <span className="connection-failed">Cannot connect to the server right now. Please check your internet connection or try again later.</span>}
    </form>
  )
}

export default Login