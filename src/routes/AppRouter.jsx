import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../pages/auth/Login';
import Homepage from '../pages/Homepage';
import VerifyAccount from '../pages/auth/VerifyAccount';
import Register from '../pages/auth/Register';


const AppRouter = () => {
  return (
    <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Homepage />} />
        <Route path='/verifyAccount/:token' element={<VerifyAccount />} /> {/* ✅ Acepta token */}
    </Routes>
    

  )
}

export default AppRouter;