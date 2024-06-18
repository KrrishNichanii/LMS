import React from 'react'
import {FiMenu} from 'react-icons/fi' ; 
import {AiFillCloseCircle} from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import {logout} from '../Redux/Slices/AuthSlice.js'

function HomeLayout({children}) {
   
  const dispatch = useDispatch() ; 
  const navigate = useNavigate() ; 
  
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn) ; 
  const role = useSelector((state) => state.auth.role) ; 
  
  
  
  const changeWidth = () => {
    const drawer = document.getElementsByClassName('drawer') ; 
    drawer[0].style.width = '16%' ;   
    const drawerSide = document.getElementsByClassName('drawer-side') ;
    drawerSide[0].style.width = '16%' ;
  }
  
  const hideDrawer = () => {
    const element = document.getElementsByClassName('drawer-toggle') ;
    element[0].checked = false ; 
    
    const drawerSide = document.getElementsByClassName('drawer-side') ;
    drawerSide[0].style.width = '0' ; 
  }
  
  const handleLogout = async (e) => {
        e.preventDefault()
        
        const res = await dispatch(logout()) ; 
        if(res?.payload?.success)
        navigate('/') ; 
  }

return (
    <div className="min-h-[90vh]">
        <div className="drawer absolute left-0 z-50 w-0">
             <input className='drawer-toggle' id='my-drawer' type="checkbox" />
             <div className="drawer-content">
                <label htmlFor="my-drawer" className='cursor-pointer relative w-full'>
                     <FiMenu  
                     onClick={changeWidth}
                     size={'32px'}
                     className='font-bold text-white m-4'
                     />
                </label>
             </div>
             <div className="drawer-side w-0">
                <label htmlFor="my-drawer" className='drawer-overlay'>   
                </label>

                <ul className="menu bg-base-200 text-base-content relative w-full h-[100%]">
                    <li className='w-fit absolute right-2 z-50'>
                        <button onClick={hideDrawer}>
                          <AiFillCloseCircle  size={24}  />
                        </button>
                    </li>

                    <li className='h-[4rem] text-xl px-2'>
                         <Link to="/" >Home</Link>
                    </li>

                    {isLoggedIn && role === 'ADMIN' && (
                        <li className='h-[4rem] text-xl px-2'>
                            <Link to = '/admin/dashboard'>Admin DashBoard</Link>
                        </li>
                     )} 

                    {isLoggedIn && role === 'ADMIN' && (
                        <li className='h-[4rem] text-xl px-2'>
                            <Link to = '/course/create'>Create new course</Link>
                        </li>
                     )} 

                    <li className='h-[4rem] text-xl px-2'>
                        <Link to="/courses" >All Courses</Link>
                    </li>

                    <li className='h-[4rem] text-xl px-2'>
                        <Link to="/contact" >Contact Us</Link>
                    </li>

                    <li className='h-[4rem] text-xl px-2'>
                        <Link to="/about" >About Us</Link>
                    </li>

                    {!isLoggedIn && (
                            <div className="w-[90%] flex items-center justify-between absolute bottom-4">

                                <button onClick={() => navigate('/login')} className='btn btn-primary text-lg  py-1 font-semibold text-white rounded-md w-[45%]'>
                                    <Link >Login</Link>
                                </button>

                                <button onClick={() => navigate('/signup')} className='btn btn-secondary text-lg py-1 font-semibold text-white rounded-md w-[45%]'>
                                    <Link >Signup</Link>
                                </button>

                            </div>
                       
                    )}


                    {isLoggedIn && (
                            <div className="w-[90%] flex items-center justify-between absolute bottom-4">

                                <button onClick={() => navigate('/user/profile')} className='btn btn-primary text-lg  py-1 font-semibold text-white rounded-md w-[45%]'>
                                    <Link >Profile</Link>
                                </button>

                                <button onClick={() => handleLogout} className='btn btn-secondary text-lg py-1 font-semibold text-white rounded-md w-[45%]'>
                                    <Link >Logout</Link>
                                </button>

                            </div>
                       
                    )}

                </ul>
             </div>
        </div>

        {children}

        <Footer/>
    </div>
  )
}

export default HomeLayout