var express = require("express");
var router = express.Router();
var bcrypt = require('bcryptjs');
var config = require('../config');
var jwt = require('jsonwebtoken');

// Load User model
const User = require("../models/Users");
const Applicant = require("../models/applicant")

router.get("/", function (req, res) {
    var email = req.query.email
    Applicant.findOne({ email }).then(applicant => {
        if (!applicant) {
            res.status(404).send({ "error": "not found" })
        } else {
            return res.status(200).json(applicant);
        }
    }).catch(e => {
        console.log(e);
        return res.status(404);
    });
});


router.post("/edit", (req, res) => {
    var tok = req.body.token;
    var email = req.body.email;
    console.log(tok, email)
    if (jwt.verify(tok, config.secret)) {
        Applicant.findOne({ email }).then(userdet => {
            if (!userdet) {
                var newApplicant = new Applicant(
                    {
                        name: req.body.name,
                        email: email,
                        rating: 0,
                        skills: req.body.skills,
                        education: req.body.education,
                    }
                );
                newApplicant.save();
            } else {
                Applicant.findOneAndUpdate({ email }, { name: req.body.name, skills: req.body.skills, education: req.body.education }, { new: true, useFindAndModify: false }, function (err, doc) {
                    if (err)
                        console.log(err)
                    else
                        console.log(doc)
                })
            }
        });
        return res.status(200).send({
            "error": "no"
        });
    }
});


module.exports = router;
