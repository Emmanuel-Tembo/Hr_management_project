// require dependencies
const express = require('express');
const dotenv = require('dotenv');
const attendanceRoutes = require('./routes/attendanceRoute.js');
const leaveRoutes = require('./routes/leaveRoute.js');
const cors = require('cors');
dotenv.config(); // gives us access to config files NAMING IS IMPORTANT

// console.log(await getEmployees());
const app = express(); // making use of the data 
const PORT = process.env.PORT; // env imports

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/', attendanceRoutes);
app.use('/leave', leaveRoutes);

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));

// backend current flow: index -> routes -> controllers -> database link/ modal (mvc)