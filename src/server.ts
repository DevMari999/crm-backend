import app from './app';
import {createServer} from "http";
import * as mongoose from "mongoose";
import {configs} from "./configs/configs";

mongoose.connect(configs.DB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 8080;
const httpServer = createServer(app);

httpServer.listen(PORT, () => {
    console.log(`Server has started on PORT ${PORT}`);
});
