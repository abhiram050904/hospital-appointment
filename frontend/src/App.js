import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Appointment from './pages/Appointment'
import Contact from './pages/contact'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import Myappointments from './pages/Myappointments'
import Myprofile from './pages/Myprofile'
import Navbar from './components/Navbar'
const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/doctors' element={<Doctors/>}/>
        <Route path='/doctors/:speciality' element={<Doctors/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/my-appointments' element={<Myappointments/>}/>
        <Route path='/profile' element={<Myprofile/>}/>
        <Route path='/appointment/:docId' element={<Appointment/>}/>
      </Routes>
    </div>
  )
}

export default App
