var express = require("express");
var router = express.Router();
var config = require('../config');
var jwt = require('jsonwebtoken');

// Load User model
const Recruiter=require('../models/recruiter')

router.get("/", function (req, res) {
    var email = req.query.email
    Recruiter.findOne({ email }).then(recruiter => {
        if (!recruiter) {
            res.status(404).send({ "error": "not found" })
        } else {
            return res.status(200).json(recruiter);
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
        Recruiter.findOne({ email }).then(userdet => {
            if (!userdet) {
                console.log('check#1')
                var newRecruiter = new Recruiter(
                    {
                        name: req.body.name,
                        email: email,
                        contact: req.body.contact,
                        bio: req.body.bio,
                    }
                );
                newRecruiter.save();
            } else {
                Recruiter.findOneAndUpdate({ email }, { name: req.body.name, contact: req.body.contact, bio: req.body.bio, }, { new: true, useFindAndModify: false }, function (err, doc) {
                    if (err)
                        return res.status(400)
                    else
                        return res.send(doc)
                })
            }
        });
    }
});


module.exports = router;
