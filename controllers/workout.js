const Workout = require('../models/workout');

const addWorkout = async (req, res) => {
    try {
        // Destructure fields from the request body
        const { name, duration, status } = req.body;

        const userId = req.user.id;

        // Validate required fields
        if (!userId || !name || !duration) {
            return res.status(400).json({ message: 'userId, name, and duration are required.' });
        }

        // Create a new workout document
        const newWorkout = new Workout({
            userId,
            name,
            duration,
            status: status || 'pending', // Default to 'pending' if not provided
        });

        // Save the workout to the database
        const savedWorkout = await newWorkout.save();

        // Send a success response
        res.status(201).json({
            message: 'Workout added successfully.',
            workout: savedWorkout,
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding the workout.' });
    }
};

const getMyWorkouts = (req, res) => {
    return Workout.find({userId: req.user.id})
    .then(workout => {
        if(workout.length > 0){
            return res.status(200).send(workout);
        } else {
            return res.status(404).send({message: 'No workouts found'})
        }
    })
    .catch(err => {
        return res.status(500).send(err);
    })
}

const updateWorkout = (req, res) => {

    const userId = req.user.id;

    let updatedWorkout = {
        name: req.body.name,
        duration: req.body.duration
    }

    return Workout.findOneAndUpdate({_id: req.params.workoutId, userId: userId}, updatedWorkout,{new:true})
    .then(workout => {
        if(workout){
            return res.status(200).send({message: 'Workout updated successfully', updatedWorkout: workout})
        } else {
            return res.status(404).send({error: 'Workout does not exist'});
        }
    })
    .catch(err => {
        res.status(500).send(err);
    })

}

const deleteWorkout = (req, res) => {

    const userId = req.user.id;

    return Workout.findOneAndDelete({_id: req.params.workoutId, userId: userId})
    .then((workout) => {
        if(workout){
            return res.status(200).send({message: 'Workout deleted successfully'})
        } else {
            return res.status(404).send({message: 'Workout does not exist'})
        }
    })
    .catch(err => res.status(500).send(err))
}

const completeWorkoutStatus = (req, res) => {

    const userId = req.user.id;

    const completedWorkout = {
        status: 'completed'
    }

    return Workout.findOneAndUpdate({_id: req.params.workoutId, userId: userId}, completedWorkout, {new:true})
    .then(workout => {
        if(workout){
            return res.status(200).send({message: 'Workout status updated successfully', updatedWorkout: workout})
        } else {
            return res.status(404).send({message: 'Does not exist'})
        }
    })
    .catch(err => res.status(500).send(err))
}

module.exports = {addWorkout, getMyWorkouts, updateWorkout, deleteWorkout, completeWorkoutStatus};