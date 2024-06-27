import { Router} from 'express' ; 
import { addComment, addLectureToCourseById, createCourse, deleteComment, getAllCourses, getLecturesByCourseId, removeCourse, removeLectureById, updateCourse } from '../controllers/course.controller.js';
import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router() ; 

router.get('/',isLoggedIn,getAllCourses) ;
router.get('/:cid',isLoggedIn,authorizedRoles("USER","ADMIN"),getLecturesByCourseId);

router.post('/',
      isLoggedIn,
      authorizedRoles('ADMIN'),
      upload.single('thumbnail'),
      createCourse) ; 
router.delete('/comment',isLoggedIn,authorizedRoles('ADMIN','USER'),deleteComment) ; 

router.put('/:id',isLoggedIn,authorizedRoles('ADMIN'),updateCourse) ; 
router.delete('/:id',isLoggedIn,authorizedRoles('ADMIN'),removeCourse) ; 
router.delete('/',isLoggedIn,authorizedRoles('ADMIN'),removeLectureById)
router.post('/comment',isLoggedIn,addComment) ; 

router.post('/:id' ,  
      isLoggedIn,
      authorizedRoles('ADMIN'), 
      upload.single('lecture'), 
     addLectureToCourseById
    )
export default router