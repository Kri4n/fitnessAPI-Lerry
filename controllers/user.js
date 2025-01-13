const User = require('../models/user');
const auth = require('../auth');
const bcrypt = require('bcrypt'); 

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email.includes("@")) {
            return res.status(400).send({message: 'Invalid email format. Please include @'});
        }

        if(password.length < 8) {
            return res.status(400).send({message: 'Password must be at least 8 characters long'});
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'Email already registered' });
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email: email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        return res.status(201).send({
            message: 'Registered Successfully'
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).send({ message: 'Email not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid password' });
        }

        const accessToken = auth.createAccessToken(user);
        return res.status(200).send({
            message: 'Logged in successfully',
            access: accessToken
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

module.exports = { register, login };