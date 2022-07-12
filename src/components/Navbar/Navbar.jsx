import { useState } from 'react'
import { Menu } from 'semantic-ui-react'
import './Navbar.css'

const Navbar = ({ existingUser, userName }) => {

  return (
    <div className="nav-container">
      <Menu secondary={true}>
        <Menu.Item
          name="home"
        />
        {existingUser &&
          <Menu.Item
            name={userName}
          />
        }
      </Menu>
    </div>
  )
}

export default Navbar