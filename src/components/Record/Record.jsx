import './Record.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const Record = ({ socket }) => {

  const navigate = useNavigate()
  const { id } = useParams()

  const [record, setRecord] = useState({})

  const [invalidURL, setInvalidURL] = useState(false)

  useEffect(() => {
    socket.emit('fetchOne', id, localStorage.getItem('user'), (response) => {
      if (response.status === 401) {
        navigate('/login')
      }

      if (response.status === 400) {
        setInvalidURL(true)
        return
      }

      if (response.status === 200) {
        setInvalidURL(false)
        setRecord(response.body)
      }
    })
  }, [])

  return (
    <div className='record-info-container'>
      {!invalidURL && Object.keys(record).length > 0 &&
        <div className='record-info'>
          <span className='record-name'> {record.name} </span>
          <span className='record-desc'> {record.description} </span>
          <div className='images-container'>
            {record.images.length > 0 && record.images.map((image, index) => {
              return (
                <div className={record.images.length === 1 ? 'image-container-single' : 'image-container'} key={index}>
                  <img
                    key={index}
                    src={image}
                    alt="Image here"
                  />
                </div>
              )
            })}
          </div>
        </div>
      }
      {invalidURL && <span className='error-text'>Invalid URL.</span>}
    </div>
  )
}

export default Record