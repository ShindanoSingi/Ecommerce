const bodyParser = require('body-parser');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

dbConnect()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser);

app.use("/api/user", authRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})
