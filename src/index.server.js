const express = require("express");
require('dotenv').config();
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");



//routes

const userRoutes = require("./routes/user");





// mongodb connection
mongoose.connect(
    `mongodb://localhost:27017/${process.env.DB_NAME}`,
    {
        useNewUrlParser: true,
         useUnifiedTopology: true,
         useCreateIndex: true
    }
).then(() => {
    console.log("database connected!");
});

app.use(bodyParser.json());
app.use("/api", userRoutes);






app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});