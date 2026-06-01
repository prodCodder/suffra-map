import express, { Request, Response, NextFunction } from 'express';
import connectMongoDB from './config/dbMongo.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import ENV from './config/env.js';

const dirname = import.meta.dirname;

const app = express();

// IMPORT ROUTER
import elecRouter from './router/election.router.js';
import mapRouter from './router/map.router.js';
import userRouter from './router/user.router.js';
import contactRouter from './router/contact.router.js';


// CONNEXION MONGO
connectMongoDB(ENV.MONGO_HOST, ENV.MONGO_DB_NAME, ENV.MONGO_USERNAME, ENV.MONGO_PASSWORD)

// MIDDLEWARES
app.use(cors({
    origin: ['http://localhost:5173', 'https://www.sufframap.fr'],
    credentials: true
}));
app.use('/uploads', express.static(path.join(dirname, 'uploads')));
app.use(express.json());
app.use(cookieParser());

// // URLS API PREFIX
app.use("/api/elections", elecRouter)
app.use("/api/map", mapRouter)
app.use("/api/users", userRouter)
app.use("/api/contact", contactRouter)

// MIDDLEWARES DE GESTION D'ERROR
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || "Une erreur est survenue"
    const details = error.details || null;

    res.status(status).json({
        error: {
            status, 
            message,
            details
        }
    })
})

export default app;