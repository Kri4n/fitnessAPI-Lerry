const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const workoutRoutes = require('./routes/workout');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

mongoose.connect('mongodb+srv://admin:admin@wdc028-course-booking.jxleq.mongodb.net/FitnessTracker?retryWrites=true&w=majority', {});

mongoose.connection.once('open', () => {
    console.log('Now connected to mongodb atlas')
});

// User Routes
app.use('/users', userRoutes);
app.use('/workouts', workoutRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));

module.exports = {app,mongoose}