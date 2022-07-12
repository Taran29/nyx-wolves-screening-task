import { useNavigate } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import './Navbar.css'

const Navbar = ({ existingUser, setExistingUser }) => {
  const navigate = useNavigate()

  return (
    <div className="nav-container">
      <Menu secondary={true}>
        <Menu.Item
          name="Home"
        />
        {existingUser &&
          <Menu.Item
            name="Logout"
            onClick={() => {
              localStorage.removeItem('user')
              localStorage.removeItem('userID')
              setExistingUser(false)
              navigate('/login')
            }}
          />
        }
      </Menu>
    </div>
  )
}

export default Navbar