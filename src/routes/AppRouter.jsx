import { Routes, Route } from 'react-router-dom'

import Login from '../pages/auth/Login';
import Homepage from '../pages/Homepage';
import VerifyAccount from '../pages/auth/VerifyAccount';
import Register from '../pages/auth/Register';
import ResetPassword from '../pages/forgotpassword/ResetPassword';
import ResetPasswordForm from '../pages/forgotpassword/ResetPasswordForm';


const AppRouter = () => {
  return (
    <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/verifyAccount/:token' element={<VerifyAccount />} /> {/* ✅ Acepta token */}
        <Route path='/home' element={<Homepage />} />
        <Route path='/reset-password' element={<ResetPassword />}/>
        <Route path='/reset-form' element={<ResetPasswordForm />}/>
    </Routes>
    

  )
}

export default AppRouter;