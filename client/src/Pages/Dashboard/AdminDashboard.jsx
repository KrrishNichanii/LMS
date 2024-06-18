import React, { useEffect } from 'react'
import HomeLayout from '../../Layouts/HomeLayout'
import { Chart as ChartJS, ArcElement,Tooltip,Legend,CategoryScale,LinearScale,BarElement,Title} from 'chart.js'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getStatsData } from '../../Redux/Slices/StatSlice';
import { deleteCourse, getAllCourses } from '../../Redux/Slices/CourseSlice';
import { getPaymentRecord } from '../../Redux/Slices/RazorpaySlice';
import { Bar, Pie } from 'react-chartjs-2';
import { FaUsers } from 'react-icons/fa6';
import { FcSalesPerformance } from 'react-icons/fc';
import { GiMoneyStack } from 'react-icons/gi';
import { BsCollectionPlayFill, BsTrash } from 'react-icons/bs';

ChartJS.register(ArcElement,BarElement,CategoryScale,Legend,LinearScale,Title,Tooltip);


function AdminDashboard() {
  
   const dispatch = useDispatch();
   const navigate = useNavigate() ; 
   
   const {allUsersCount,subscribedCount} = useSelector(state => state.stat)
   const {allPayments,monthlySalesRecord} = useSelector(state => state.razorpay)
   
   //console.log(allUsersCount,subscribedCount);
   const userData = {
    labels:['Registered User','Enrolled User'] , 
    fontColor:'white',
    datasets: [
        {
            label: 'User Details' ,
            data: [allUsersCount,subscribedCount] ,
            backgroundColor: ['yellow','green'] , 
            borderWidth: 1 ,
            borderColor: ['yellow','green']
        }
    ]
   }

   const salesData = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    fontColor:'white',
    datasets:[
        {
            label: 'Sales / month',
            data:monthlySalesRecord,
            backgroundColor: ['rgb(255,99,132'] ,
            borderColor:['white'] , 
            borderWidth: 2
        }
    ]
   }

   const optionsPie = {
    plugins: {
        legend: {
            labels: {
                font: {
                    size: 18, // Increase legend font size
                },
                color: 'white', // Set legend font color to white
            },
        },
        tooltip: {
            bodyFont: {
                size: 16, // Increase tooltip font size
            },
            callbacks: {
                labelTextColor: () => 'white', // Set tooltip font color to white
            },
        },
    },
    };

    const optionsBar = {
    plugins: {
        legend: {
            labels: {
                font: {
                    size: 18, // Increase legend font size
                },
                color: 'white', // Set legend font color to white
            },
        },
        tooltip: {
            bodyFont: {
                size: 16, // Increase tooltip font size
            },
            callbacks: {
                labelTextColor: () => 'white', // Set tooltip font color to white
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Tooltip background color for better contrast
        },
    },
    scales: {
        y: {
            ticks: {
                font: {
                    size: 14, // Y-axis font size
                },
                color: 'white', // Y-axis font color
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.2)', // Y-axis grid color
            },
        },
        x: {
            ticks: {
                font: {
                    size: 14, // X-axis font size
                },
                color: 'white', // X-axis font color
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.2)', // X-axis grid color
            },
        },
    },
    };

   const myCourses = useSelector(state=> state?.course?.courseData) ; 

   const onCourseDelete = async  (id) => {
    if(window.confirm('Are you sure you want to delete the course ?')){
       const res = await dispatch(deleteCourse(id));
       if(res?.payload?.success){
         await dispatch(getAllCourses()) ; 
       }
    }
   }

   useEffect(() => {
    (
        async () => {
            await dispatch(getAllCourses()) ;
            await dispatch(getStatsData()) ; 
            const res = await dispatch(getPaymentRecord()) ; 
            //console.log(res);
        }
    )()
   },[])


  return (
   <HomeLayout>
       <div className="min-h-[90vh] py-5 mb-[7rem] flex flex-col flex-wrap gap-10 text-white">
           <h1 className='text-center text-5xl font-semibold text-yellow-500'>
            Admin Dashboard
           </h1>
           <div className="grid grid-cols-2 gap-x-5 m-auto mx-10">
                 <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-lg">
                    <div className="w-96 h-96">
                        <Pie className='w-full h-full' data={userData} options={optionsPie} />
                    </div>
                    <div className="grid grid-cols-2 gap-16">
                        <div className="flex items-center justify-between p-5 gap-5 rounded-lg shadow-lg">
                            <div className="flex flex-col items-center ">
                                <p className='font-semibold'>Registered Users</p>
                                 <h3 className='text-4xl font-bold'>{allUsersCount}</h3>
                            </div>
                            <FaUsers className='text-yellow-500 text-5xl'/> 
                        </div>

                        <div className="flex items-center justify-between p-5 gap-5 rounded-lg shadow-lg">
                            <div className="flex flex-col items-center ">
                                <p className='font-semibold'>Subscribed Users</p>
                                 <h3 className='text-4xl font-bold'>{subscribedCount}</h3>
                            </div>
                            <FaUsers className='text-green-500 text-5xl'/> 
                        </div>
                    </div>
                 </div>
                 <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-lg">
                    <div className="h-96 w-full relative">
                        <Bar  className='absolute bottom-0 h-80 w-full' data={salesData} options={optionsBar}/>
                    </div>
                    <div className="grid grid-cols-2 gap-16">
                        <div className="flex items-center justify-between p-5 gap-5 rounded-lg shadow-lg">
                            <div className="flex flex-col items-center ">
                                <p className='font-semibold'>Subscription Count</p>
                                <h3 className='text-4xl font-bold'>{allPayments?.count}</h3>
                            </div>
                            <FcSalesPerformance className='text-yellow-500 text-5xl'/> 
                        </div>

                        <div className="flex items-center justify-between p-5 gap-5 rounded-lg shadow-lg">
                            <div className="flex flex-col items-center ">
                                <p className='font-semibold'>Total Revenue</p>
                                <h3 className='text-4xl font-bold'>{allPayments?.count * 499}</h3>
                            </div>
                            <GiMoneyStack className='text-green-500 text-5xl'/> 
                        </div>
                    </div>
                 </div>
           </div>
            {/* course overview */}
           <div className="mx-[10%] w-[80%] self-center flex flex-col items-center justify-center gap-10 mb-10">
               <div className="flex w-full items-center justify-between">
                   <h1 className='text-center text-3xl font-semibold'>
                    Courses overview
                   </h1>

                   <button 
                   className='w-fit bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 rounded-md py-2 px-4 font-semibold text-lg cursor-pointer'
                   onClick={() => navigate('/course/create')} >
                    Create new course
                   </button>
               </div>
               <table className='table overflow-x-scroll'>
                   <thead>
                    <tr>
                        <th className='text-lg text-center'>S No</th>
                        <th className='text-lg text-center'>Course Title</th>
                        <th className='text-lg text-center'>Course Category</th>
                        <th className='text-lg text-center'>Instructor</th>
                        <th className='text-lg text-center'>Total Lectures</th>
                        <th className='text-lg text-center'>Description</th>
                        <th className='text-lg text-center'>Actions</th>
                    </tr>
                   </thead>
               <tbody>
                {myCourses?.map((course,idx) => {
                    return (
                        <tr key={course._id}>
                            <td className='text-lg text-center'>{idx+1}</td>
                            <td className='text-lg text-center'>
                                <textarea readOnly value={course?.title} className='w-30 h-auto bg-transparent resize-none'/>
                            </td>
                            <td className='text-lg text-center'>{course?.category}</td>
                            <td className='text-lg text-center'>{course?.createdBy}</td>
                            <td className='text-lg text-center'>{course?.numbersOfLectures}</td>
                            <td className='max-w-28 overflow-hidden text-ellipsis whitespace-nowrap'>
                                <textarea  value={course?.description} readOnly className='w-80 h-auto bg-transparent resize-none'  />
                            </td>
                            <td className='flex items-center gap-4 text-center justify-center'>
                                <button
                                className='bg-green-500 hover:bg-green-600 transition-all ease-in-out duration-300 text-xl py-2 px-4 rounded-md font-bold'
                                 onClick={() => navigate('/course/displaylectures',{state:{...course}})}>
                                <BsCollectionPlayFill/>
                                 </button>

                                <button
                                className='bg-red-500 hover:bg-red-600 transition-all ease-in-out duration-300 text-xl py-2 px-4 rounded-md font-bold'
                                 onClick={() => onCourseDelete(course?._id)}>
                                <BsTrash/>
                                 </button>
                                 
                            </td>
                        </tr>
                    )
                })}
               </tbody>
               </table>
           </div>
       </div>
   </HomeLayout>
  )
}

export default AdminDashboard