import React from 'react'
import { FiLogOut } from "react-icons/fi";

const Logout = () => {

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login page
    }   

  return (
    <div>
        <button className='hover:cursor-pointer' onClick={handleLogout}><FiLogOut color='#cdd6f4' /> </button>
    </div>
  )
}

export default Logout