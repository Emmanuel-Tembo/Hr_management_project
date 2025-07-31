const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;


// REGISTER
exports.register = async (req, res) => {
    const {emp_id, username, password} = req.body;


    if (!emp_id || !username || !password) {
        return res.status(400).json({message: 'Please provide emp_id, username and password'});
    }


    try {
        const existingUserById = await userModel.findUserByEmpId(emp_id);
        if (existingUserById){
            return res.status(409).json({message: 'Employee ID already registered'});
        }


        const existingUserByUsername = await userModel.findUserByUsername(username);
        if (existingUserByUsername) {
            return res.status(409).json({message: 'Username already taken'});
        }


        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const userId = await userModel.createUser(emp_id, username, passwordHash);
        res.status(500).json({message: 'User registered successfully!', userId});
    } catch (e) {
        console.error('Error during registration: ', e);
        res.status(500).json({message: 'Server error during registration'});
    }
}


// LOGIN
exports.login = async (req, res) => {
    const {username, password} = req.body;


    if (!username || !password) {
        return res.status(400).json({message: 'Please provide username and password'});
    }


    try {
        const user = await userModel.findUserByUsername(username);
        if (!user) {
            return res.status(401).json({message: 'Invalid credentials'});
        }


        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({message: 'Invalid credentials'});
        }


        const token = jwt.sign(
            {user_id: user.user_id, emp_id: user.emp_id, username: user.username},
            JWT_SECRET,
            {expiresIn: '1h'}
        );


        res.status(200).json({ message: 'Logged in successfully!', token });
    } catch (e) {
        console.error('Error during login: ', e);
        res.status(500).json({message: 'Server error during login'});
    }
}
