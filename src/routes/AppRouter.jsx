import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login';
import ResetPassword from '../pages/forgotpassword/ResetPassword';
import ResetPasswordForm from '../pages/forgotpassword/ResetPasswordForm';
import Register from '../pages/Register';



const AppRouter = () => {
  return (
    <Routes>
      {/* rutas publicas */}
        <Route path='/login' element={<Login/>}/>
        <Route path='/reset-password' element={<ResetPassword />}/>
        <Route path='/reset-form' element={<ResetPasswordForm />}/>
        <Route path='/register' element={<Register />}/>
        
    </Routes>
    

  )
}

export default AppRouter;