var express = require("express");
const skills = require("../models/skills");
var router = express.Router();

// Load User model
const Skills = require("../models/skills")

router.get("/", function (req, res) {
    Skills.find(function (err, skills) {
        if (err)
            console.log(err)
        else
            res.send(skills)
        console.log(skills)
    })
});

router.post("/add", async (req, res) => {
    const nskillAr = req.body
    nskillAr.map(async (value, index) => {
        const newSkill = new Skills({
            skill: value
        })
        await newSkill.save()
    })
});



module.exports = router;
