import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import bodyParser from 'body-parser';


import databaseService from './service/database.service.js';
import userRouter from './routes/user.route.js';
import tokenRequest from './routes/token.route.js';
import itemRouter from './routes/item.route.js';
import billingRoute from './routes/billing.route.js';

const app = express();


config()
app.use(express.json())
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.send("Hello! Welcome to my Express server.");
});

app.use('/user', userRouter)
app.use('/token', tokenRequest)
app.use('/item', itemRouter)
app.use('/checkout', billingRoute)

// Error handling middleware
app.use((err, req, res, next) => {
    if (err.message) {
        return res.json({ error: err.message });
    } else {
        return res.json({ err });
    }
});

// ON START
app.listen(process.env.PORT, async (err) => {
    await databaseService.connect()
    console.log(`Your app is listening on: http://localhost:${process.env.PORT}`)
})