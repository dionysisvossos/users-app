const User = require('../models/user.model');
const UserService = require('../services/user.services');
const bcrypt = require('../node_modules/bcrypt');
const logger = require('../logger/logger');

exports.findAll = async(req, res) => {
    console.log('Find All users from collection users');
    try {
        // const result = await User.find();
        const result = await UserService.findAll();
        res.status(200).json({status: true, data: result});
        logger.info('Successfully read all users from DB');
    } catch (err) {
        console.log('Problem in reading users', err.message);
        logger.error('Problem in reading users from DB', err.message);
        res.status(400).json({status: false, data: err.message});
    }
}

exports.findOne = async(req, res) => {
    console.log('Find user with specific username');
    let username = req.params.username;
    try {
        // const result = await User.findOne({username: username});
        const result = await UserService.findOne(username);
        if (result) {
        res.status(200).json ({status: true, data: result});
    } else {
        res.status(404).json({status: false, data: 'User not found'});
    }
    } catch (err) {
        console.log('Problem in finding user', err.message);
        res.status(400).json({status: false, data: err.message});
    }
}

exports.create = async(req, res) => {
    console.log('Create user in collection users');
    let data = req.body;
    const SaltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, SaltOrRounds)
    
    const newUser = new User({
        username: data.username,
        password: hashedPassword,
        name: data.name,
        surname: data.surname,
        email: data.email,
        address: {
            area: data.address.area,
            road: data.address.road,
        }
    });

    try {
        const result = await newUser.save();
        res.status(200).json ({status: true, data: result});
    } catch (err) {
        console.log('Problem in creating user', err.message);
        res.status(404).json({status: false, data: err.message});
    }
}

exports.update = async(req, res) => {
    const username = req.body.username;

    console.log('Update user with username: ', username);

    const updateUser = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        address: {
            area: req.body.address.area,
            road: req.body.address.road
        }
    };

    try {
        const result = await User.findOneAndUpdate({username: username}, updateUser, {new: true});
        if (result) {
            res.status(200).json({status: true, data: result});
        } else {
            res.status(404).json({status: false, data: 'User not found'});
        }
    }   catch (err) {
        console.log('Problem in updating user', err.message);
        res.status(400).json({status: false, data: err.message});
    }
}

exports.deleteByUsename = async(req, res) => {
    const username = req.params.username;
    console.log('Delete user with username: ', username);

    try {
        const result = await User.findOneAndDelete({username: username});
        if (result) {
            res.status(200).json({status: true, data: result});
        } else {
            res.status(404).json({status: false, data: 'User not found'});
        }
    } catch (err) {
        console.log('Problem in deleting user', err.message);
        res.status(400).json({status: false, data: err.message});
    }
}

exports.deleteByEmail = async(req, res) => {
    const username = req.params.username;
    const email = req.params.email;
    console.log('Delete user with email: ', email);

    try {
        const result = await User.findOneAndDelete({email: email});
        if (result) {
            res.status(200).json({status: true, data: result});
        } else {
            res.status(404).json({status: false, data: 'User not found'});
        }
    }
    catch (err) {
        console.log('Problem in deleting user', err.message);
        res.status(400).json({status: false, data: err.message});
    }
}