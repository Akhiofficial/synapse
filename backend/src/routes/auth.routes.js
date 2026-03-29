import { Router } from 'express';
import { registerUser, loginUser, logoutUser, getCurrentUser } from '../controllers/auth.controller.js';
import identifyUser from '../middlewears/auth.middleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', identifyUser, logoutUser);
router.get('/me', identifyUser, getCurrentUser);

export default router;