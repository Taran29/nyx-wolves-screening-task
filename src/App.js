import {
  Navbar,
  Home,
  Login,
} from './components'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [existingUser, setExistingUser] = useState()
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const setUser = () => {
      if (localStorage.getItem('username')) {
        setExistingUser(true)
        setUserName(localStorage.getItem('username'))
      } else setExistingUser(false)
    }
    setUser()
    window.addEventListener('storage', setUser)
    return () => window.removeEventListener('storage', setUser)
  }, [])

  return (
    <div className="App">
      <Router>
        <Navbar existingUser={existingUser} userName={userName} />
        <Routes>
          <Route path="*" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home setExistingUser={setExistingUser} />} />
          <Route path="/login" element={<Login setUserName={setUserName} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
