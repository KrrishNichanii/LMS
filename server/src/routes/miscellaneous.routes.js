import { Router } from "express";
import { authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import { contactUs, userStats } from "../controllers/miscellaneous.controller.js";

const router = Router() ;

router.post('/contact',contactUs);
router.get('/admin/stats/users',isLoggedIn,authorizedRoles('ADMIN'),userStats);

export default router ; 
