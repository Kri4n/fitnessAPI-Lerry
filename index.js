const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const workoutRoutes = require('./routes/workout');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

mongoose.connect(process.env.MONGODB_STRING, {});

mongoose.connection.once('open', () => {
    console.log('Now connected to mongodb atlas')
});

// User Routes
app.use('/users', userRoutes);
app.use('/workouts', workoutRoutes);

if(require.main === module) {
    app.listen(process.env.PORT || 4000, () => console.log(`Server running on port ${process.env.PORT || 4000}`));
}

module.exports = {app,mongoose}