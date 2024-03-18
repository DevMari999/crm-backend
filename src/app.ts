import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ordersRouter from './routes/orders.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from "./routes/user.routes";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerDefinition from './swaggerDef';
import errorHandler from "./middlewares/error.middlewar";

const options = {
    definition: swaggerDefinition,
    apis: ['./src/routes/*.ts'],
};


// @ts-ignore
const swaggerSpec = swaggerJsdoc(options);
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));

app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRouter);
app.use('/api/users', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);
export default app;
