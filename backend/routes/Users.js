var express = require("express");
var router = express.Router();
var bcrypt = require('bcryptjs');
var config =  require('../config');
var jwt = require('jsonwebtoken');

// Load User model
const User = require("../models/Users");

// GET request 
// Getting all the users
router.get("/", function (req, res) {
    User.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    })
});

// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

// POST request 
// Add a user to db
router.post("/register", (req, res) => {
    const email = req.body.email;
    User.findOne({ email }).then(user => {
        // Check if user email exists
        if (!user) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(req.body.password, salt);
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                date: req.body.date,
                password: hash,
                jtype: req.body.jtype
            });

            newUser.save()
                .then(user => {
                    res.status(200).json(user);
                })
                .catch(err => {
                    res.status(400).send(err);
                });
        }
        else {
            return res.status(409).json({
                error: "Email already exists",
            });
        }
    });

});

// POST request 
// Login
router.post("/login", (req, res) => {
    const email = req.body.email;
    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user email exists
        console.log(user)
        // console.log(bcrypt.compareSync(req.body.password,user.password));
        if (!user) {
            console.log('404 errror')
            return res.status(404).json({
                error: "Email not found",
            });
        }
        else {
            if (bcrypt.compareSync(req.body.password,user.password)) {
                var token= jwt.sign({id: user._id},config.secret,{expiresIn: 86400});
                return res.status(200).send({
                    auth:true ,
                    token:token,
                    email: user.email,
                    name: user.name,
                    jtype: user.jtype,
                });
            }
            else
                return res.status(401).json({
                    error: "Inc password",
                });
        }
    }).catch(e=>{
        return res.status(404).json({
            error: "Email not found",
        });
    });
});

module.exports = router;

