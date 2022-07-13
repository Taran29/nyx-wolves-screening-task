import { useEffect, useState } from 'react'
import { Form, Button, Input, TextArea } from 'semantic-ui-react'
import firebaseStorage from '../../firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import openSocket from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import './CreateRecord.css'

const CreateRecord = () => {

  const [name, setName] = useState('')
  const [invalidName, setInvalidName] = useState(false)

  const [description, setDescription] = useState('')
  const [invalidDesc, setInvalidDesc] = useState(false)

  const [images, setImages] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [exceededImages, setExceededImages] = useState(false)
  const [noImages, setNoImages] = useState(false)

  const [progress, setProgress] = useState([])

  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    if (name.length === 0) {
      setInvalidName(true)
      return
    }
    setInvalidName(false)

    if (description.length === 0) {
      setInvalidDesc(true)
      return
    }
    setInvalidDesc(false)

    if (images.length === 0) {
      setNoImages(true)
      return
    }
    setNoImages(false)

    for await (const [index, image] of images.entries()) {
      const storageRef = ref(firebaseStorage, `images/${Date.now().toString()}${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on('state-changed',
        (snapshot) => {
          let temp = progress
          temp[index] = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setProgress(temp)
        },
        (error) => {

        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref)
          setImageUrls(prev => [...prev, url])
        }
      );
    }
  };

  useEffect(() => {
    const socket = openSocket('http://localhost:5001')

    if ((images.length > 0) && (images.length === imageUrls.length)) {
      const record = {
        name: name,
        description: description,
        images: imageUrls,
        user: localStorage.getItem('user')
      }

      socket.emit('create', record, (response) => {
        if (response.status === 401) {
          navigate('/login')
          return
        }

        if (response.status === 400) {
          alert(response.message)
          return
        }

        if (response.status === 200) {
          navigate('/home')
        }
      })
    }
  }, [imageUrls]) //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Form
      className='create-record-container'
      onSubmit={onSubmit}
    >
      <h2>Add a new record</h2>
      <Form.Field>
        <Input
          type="text"
          placeholder="Enter name..."
          onChange={(e) => setName(e.target.value)}
        />
        {invalidName && <span className='error-text'>Name cannot be empty</span>}
      </Form.Field>
      <Form.Field>
        <TextArea
          placeholder="Enter description..."
          maxLength={100}
          onChange={(e) => setDescription(e.target.value)}
        />

        {invalidDesc && <span className='error-text'>Description cannot be empty</span>}
      </Form.Field>

      <Form.Field>
        <span>Add images (max 3)</span>
        <Input
          className='image-input'
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files.length > 3) {
              setExceededImages(true)
            } else {
              setImages([])
              setExceededImages(false)
              let zeroes = new Array(e.target.files.length).fill(0)
              setProgress(zeroes)
              setImages([...e.target.files])
            }
          }}
        />

        {noImages && <span className='error-text'>Add at least 1 image.</span>}
        {exceededImages && <span className='error-text'>Cannot add more than 3 images.</span>}
      </Form.Field>

      {images.length > 0 &&
        images.map((img, idx) => {
          return (
            <div key={idx} className="loading-container">
              {imageUrls[idx] ?
                <a href={imageUrls[idx]} target="_blank" rel='noreferrer'> {img.name} </a>
                :
                <span> {img.name} </span>
              }
              <progress value={progress[idx]} max={100} className="progress-bar" />

              {progress[idx] === 100 &&
                <span>✅</span>
              }

            </div>
          )
        })
      }

      <Button type='submit'>Submit</Button>
    </Form>
  )
}

export default CreateRecord