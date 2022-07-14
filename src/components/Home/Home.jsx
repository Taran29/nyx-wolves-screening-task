import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import './Home.css'

const Home = ({ socket }) => {

  const navigate = useNavigate()

  const [records, setRecords] = useState([])

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/login')
    }

    socket.emit('fetchAll', (localStorage.getItem('user')), (response) => {
      setRecords(response.body)
    })

    socket.on('fetchAgain', () => socket.emit('fetchAll', localStorage.getItem('user'), (response) => {
      setRecords(response.body)
    }))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="home-container">
      {records.length === 0 ?
        <span className='no-records'>Seems like you don't have any records. Press the + button on the bottom to start creating!</span>
        :
        <>
          <h2>Records</h2>
          {records.map((record, idx) => {
            return (
              <div
                className='record-container'
                key={idx}
              >
                <div className="info">
                  <div className='info-text'>
                    <span className='info-name'> {record.name} </span>
                    <span className='info-desc'> {record.description} </span>
                  </div>
                  <div>
                    <span
                      className='record-button'
                      onClick={() => {
                        navigate(`/record/${record._id}`)
                      }}
                    >➡️</span>
                    <span
                      className='record-button'
                      onClick={() => {
                        navigate(`/editRecord/${record._id}`)
                      }}
                    >✏️</span>
                    <span
                      className='record-button'
                      onClick={() => {
                        socket.emit('delete', record._id, localStorage.getItem('user'), (response) => {
                          console.log(response)
                        })
                      }}
                    >❌</span>
                  </div>
                </div>

                <img src={record.images[0]} alt="Image here" width={100} height={100} />
              </div>
            )
          })}
        </>
      }

      <Button
        className='create-btn'
        onClick={() => navigate('/createRecord')}
      >➕</Button>
    </div>
  )
}

export default Home