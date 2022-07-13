import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import './Home.css'

const Home = () => {

  const navigate = useNavigate()

  const [records, setRecords] = useState({})

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/login')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="home-container">
      {Object.keys(records).length === 0 &&
        <span className='no-records'>Seems like you don't have any records. Press the + button on the bottom to start creating!</span>
      }

      <Button
        className='create-btn'
        onClick={() => navigate('/createRecord')}
      >➕</Button>
    </div>
  )
}

export default Home