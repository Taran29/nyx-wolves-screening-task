import {
  Navbar,
  Home,
  Login,
  CreateRecord
} from './components'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [existingUser, setExistingUser] = useState()

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
          <Route path="/home" element={<Home setExistingUser={setExistingUser} />} />
          <Route path="/login" element={<Login setExistingUser={setExistingUser} />} />
          <Route path="/createRecord" element={<CreateRecord />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
