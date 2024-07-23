const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 4000;
const apiRouter = require("./app/routes/api");
const rateLimiter = require("./app/middlewares/apiRateLimiter");


const corsOptions = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(rateLimiter)

const db = require("./app/models");

db.sequelize.sync()
.then((result) => {
  console.log("DB Connected");
})
.catch((err) => {
  console.log(err);
});

process.on('uncaughtException', function (err) {
  console.log(err);
});

app.use("/api", apiRouter);
app.get('/', (req, res)=>{
    res.send('hi')
})
app.listen(PORT, () => {
    console.log(`App Listening to Port ${PORT}`)
})