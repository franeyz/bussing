import '../config.mjs';
import dotenv from 'dotenv';
import express from 'express';
const router = express.Router();
import cors from 'cors';
import {registerUser,loginUser, getSchedules} from '../controllers/controller.mjs';

dotenv.config();

const origin = process.env.CLIENT ?? 'http://localhost:8000';

console.log('CORS origin:', origin);

router.use(
    cors({
        credentials: true,
        origin: origin
    })
)


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/schedules', getSchedules);

export default router;