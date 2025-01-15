import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import Login from './Login'
import Home from './Home'
import ConversionHistory from './ConversionHistory'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './axiosConfig'
import { AuthProvider } from './AuthContext'

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/register' element={<Signup />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/home' element={<Home />}></Route>
            <Route path='/history' element={<ConversionHistory />}></Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
