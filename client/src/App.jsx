import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './Pages/HomePage'
import AboutUsPage from './Pages/AboutUsPage'
import NotFound from './Pages/NotFound'
import SignupPage from './Pages/SignupPage'
import LoginPage from './Pages/LoginPage'
import CourseList from './Pages/Course/CourseList'
import ContactPage from './Pages/ContactPage'
import Denied from './Pages/Denied'
import CourseDescription from './Pages/Course/CourseDescription'
import RequireAuth from './Components/Auth/RequireAuth'
import CreateCourse from './Pages/Course/CreateCourse'
import Profile from './Pages/User/Profile'
import EditProfile from './Pages/User/EditProfile'
import Checkout from './Pages/Payment/Checkout'
import CheckoutSuccess from './Pages/Payment/CheckoutSuccess'
import CheckoutFailure from './Pages/Payment/CheckoutFailure'
import DisplayLectures from './Pages/Dashboard/DisplayLectures'
import AddLecture from './Pages/Dashboard/AddLecture'
import AdminDashboard from './Pages/Dashboard/AdminDashboard'

function App() {

  return (
    <>
    
      <Routes>

      <Route  path ='/' element={<HomePage/>}/>
      <Route  path ='/about' element={<AboutUsPage/>}/>
      <Route  path ='/signup' element={<SignupPage/>}/>
      <Route  path ='/login' element={<LoginPage/>}/>
      <Route  path ='/courses' element={<CourseList/>}/>
      <Route  path ='/contact' element={<ContactPage/>}/>
      <Route  path ='/denied' element={<Denied/>}/>
      <Route  path ='/course/description' element={<CourseDescription/>}/>
      <Route element={<RequireAuth  allowedRoles={["ADMIN"]} />} >
          <Route path='/course/create' element={<CreateCourse/>} />
          <Route path='/course/addlecture' element={<AddLecture/>} />
          <Route path='/admin/dashboard' element={<AdminDashboard/>} />
      </Route>

      <Route element={<RequireAuth allowedRoles={['USER','ADMIN']}/>}>
          <Route path='/user/profile' element={<Profile/>}/>
          <Route path='/user/editprofile' element={<EditProfile/>}/>
          <Route path='/checkout' element={<Checkout/>}/>
          <Route path='/checkout/success' element={<CheckoutSuccess/>}/>
          <Route path='/checkout/fail' element={<CheckoutFailure/>}/>
          <Route path='/course/displaylectures' element={<DisplayLectures/>}/>
      </Route>
     
      <Route path='*' element={<NotFound/>}/>
      </Routes>
     
    </>
  )
}

export default App
