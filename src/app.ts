import express from "express";
import { configs } from "./configs/configs";
import * as mongoose from "mongoose";
import cors from 'cors';
import ordersRouter from './routes/orders.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from "./routes/user.routes";

const app = express();
import cookieParser from 'cookie-parser';

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());


app.use('/api/auth', authRoutes);

app.use('/api', ordersRouter);
app.use('/api/users', userRoutes);
const PORT = process.env.PORT || 8080;
mongoose.connect(configs.DB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server has started on PORT ${PORT}`);
});
