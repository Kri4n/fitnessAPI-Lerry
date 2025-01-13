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
        } 
    })
    .catch(err => {
        return res.status(500).send(err);
    })
}

const updateWorkout = (req, res) => {

    let updatedWorkout = {
        name: req.body.name,
        duration: req.body.duration
    }

    return Workout.findByIdAndUpdate(req.params.workoutId, updatedWorkout)
    .then(workout => {
        if(workout){
            res.status(200).send({message: 'Workout Updated Successfully', updatedWorkout: workout})
        } else {
            res.status(404).send({error: 'Does not exist'});
        }
    })
    .catch(err => {
        res.status(500).send(err);
    })

}

const deleteWorkout = (req, res) => {
    return Workout.findByIdAndDelete(req.params.workoutId)
    .then((workout) => {
        if(workout){
            res.status(200).send({message: 'Workout deleted successfully'})
        } else {
            res.status(404).send({message: 'Does not exist'})
        }
    })
    .catch(err => res.status(500).send(err))
}

const completeWorkoutStatus = (req, res) => {

    const completedWorkout = {
        status: 'completed'
    }

    return Workout.findByIdAndUpdate(req.params.workoutId, completedWorkout)
    .then(workout => {
        if(workout){
            res.status(200).send({message: 'Workout status updated successfully'})
        } else {
            res.status(404).send({message: 'Does not exist'})
        }
    })
    .catch(err => res.status(500).send(err))
}

module.exports = {addWorkout, getMyWorkouts, updateWorkout, deleteWorkout, completeWorkoutStatus};