import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const Home = ({ setExistingUser }) => {

  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('username')) {
      navigate('/login')
    }

  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      Hello
    </div>
  )
}

export default Home