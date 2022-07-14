import { deleteObject, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Button, Input, TextArea } from 'semantic-ui-react'
import firebaseStorage from '../../firebase'
import './EditRecord.css'

const EditRecord = ({ socket }) => {

  const { id } = useParams()
  const navigate = useNavigate()

  const [invalidURL, setInvalidURL] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])

  const [newImageURLs, setNewImageURLs] = useState([])
  const [progress, setProgress] = useState([])

  const [noImages, setNoImages] = useState(false)
  const [exceededImages, setExceededImages] = useState(false)

  const [invalidName, setInvalidName] = useState(false)
  const [invalidDesc, setInvalidDesc] = useState(false)

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
        setName(response.body.name)
        setDescription(response.body.description)
        setExistingImages(response.body.images)
      }
    })
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if ((newImages.length > 0) && (newImageURLs.length === newImages.length)) {
      const updatedRecord = {
        name: name,
        description: description,
        images: [...existingImages, ...newImageURLs]
      }

      console.log(id, updatedRecord)
      socket.emit("editRecord", id, updatedRecord, localStorage.getItem('user'), (response) => {
        if (response.status === 200) {
          navigate('/home')
        }
      })
    }
  }, [newImageURLs]) //eslint-disable-line react-hooks/exhaustive-deps

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

    if ((existingImages.length + newImages.length) > 3) {
      setExceededImages(true)
      return
    }
    setExceededImages(false)

    if ((existingImages.length + newImages.length) === 0) {
      setNoImages(true)
      return
    }
    setNoImages(false)

    for await (const [index, image] of newImages.entries()) {
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
          setNewImageURLs(prev => [...prev, url])
        }
      );
    }

    if (newImages.length === 0) {
      const updatedRecord = {
        name: name,
        description: description,
        images: existingImages
      }
      socket.emit('editRecord', id, updatedRecord, localStorage.getItem('user'), (response) => {
        if (response.status === 200) {
          navigate('/home')
        }
      })
    }
  }

  const deleteImage = (image) => {
    const imageRef = ref(firebaseStorage, image)
    deleteObject(imageRef)
    setExistingImages(prev => prev.filter(img => img !== image))
  }

  return (
    <div className='edit-record-container'>
      {!invalidURL &&
        <Form
          className='create-record-container'
          onSubmit={(e) => onSubmit(e)}
        >
          <h2>Edit record</h2>
          <Form.Field>
            <Input
              type="text"
              placeholder="Enter name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='edit-input'
            />
            {invalidName && <span className='error-text'>Name cannot be empty</span>}
          </Form.Field>
          <Form.Field>
            <TextArea
              placeholder="Enter description..."
              maxLength={200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='edit-input'
            />

            {invalidDesc && <span className='error-text'>Description cannot be empty</span>}
          </Form.Field>

          <Form.Field>
            {existingImages.length > 0 && existingImages.map((image, index) => {
              return (
                <div className='edit-images-container' key={index}>
                  <a href={image} target="_blank" rel="noreferrer">Image {index + 1}</a>
                  <span
                    className='delete-button'
                    onClick={() => deleteImage(image)}
                  >❌</span>
                </div>
              )
            })}

            {existingImages.length < 3 &&
              <Form.Field>
                <span> Add new images: (Max: {3 - existingImages.length})</span>
                <Input
                  type='file'
                  accept='image/*'
                  className='image-input'
                  multiple
                  onChange={(e) => {
                    if (e.target.files.length > (3 - existingImages.length)) {
                      setExceededImages(true)
                    } else {
                      let zeroes = new Array(e.target.files.length).fill(0)
                      setProgress(zeroes)
                      setNewImages([])
                      setExceededImages(false)
                      setNewImages([...e.target.files])
                    }
                  }}
                />
                {noImages && <span className='error-text'>Should have at least one `image.</span>}
                {exceededImages && <span className='error-text'>Cannot add more than {3 - existingImages.length} images.</span>}


                {newImages.length > 0 &&
                  newImages.map((img, idx) => {
                    return (
                      <div key={idx} className="loading-container">
                        <span> {img.name} </span>
                        <progress value={progress[idx]} max={100} className="progress-bar" />

                        {progress[idx] === 100 &&
                          <span>✅</span>
                        }

                      </div>
                    )
                  })
                }
              </Form.Field>
            }
          </Form.Field>

          <Button type='submit'>Submit</Button>
        </Form>
      }
      {invalidURL && <span>Invalid URL. Record does not exist. </span>}
    </div>
  )
}

export default EditRecord