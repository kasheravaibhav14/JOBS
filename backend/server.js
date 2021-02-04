const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const DB_NAME = "tutorial"

// routes
var testAPIRouter = require("./routes/testAPI");
var UserRouter = require("./routes/Users");
var AppprofileRouter = require("./routes/AppProfile");
var RecprofileRouter = require("./routes/RecProfile")
var skillsRouter = require("./routes/skills")
var jobRouter = require("./routes/Jobs")
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/' + DB_NAME, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', function () {
    console.log("MongoDB database connection established successfully !");
})

// setup API endpoints
app.use("/testAPI", testAPIRouter);
app.use("/user", UserRouter);
app.use("/AppProfile", AppprofileRouter);
app.use("/RecProfile", RecprofileRouter);
app.use("/skills", skillsRouter);
app.use("/jobs", jobRouter);
app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});
