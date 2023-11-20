import express from "express";
import {configs} from "./configs/configs";
import * as mongoose from "mongoose";
import ordersRouter from './routes/orders.routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api', ordersRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    mongoose.connect(configs.DB_URL);
    console.log(`Server has started on PORT ${PORT}  `)
})



