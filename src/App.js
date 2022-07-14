import {
  Navbar,
  Home,
  Login,
  CreateRecord,
  Record,
  EditRecord
} from './components'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import openSocket from 'socket.io-client'

function App() {

  const [existingUser, setExistingUser] = useState()

  const socket = openSocket('https://nyx-wolves-screening-task.herokuapp.com/')
  console.log(socket)

  useEffect(() => {
    const setUser = () => {
      if (localStorage.getItem('user')) {
        setExistingUser(true)
      } else setExistingUser(false)
    }
    setUser()
    window.addEventListener('storage', setUser)
    return () => window.removeEventListener('storage', setUser)
  }, [])

  return (
    <div className="App">
      <Router>
        <Navbar existingUser={existingUser} setExistingUser={setExistingUser} />
        <Routes>
          <Route path="*" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home socket={socket} />} />
          <Route path="/login" element={<Login setExistingUser={setExistingUser} />} />
          <Route path="/createRecord" element={<CreateRecord socket={socket} />} />
          <Route path="/record/:id" element={<Record socket={socket} />} />
          <Route path="/editRecord/:id" element={<EditRecord socket={socket} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
