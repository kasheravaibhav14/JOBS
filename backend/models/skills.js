const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const SkillSchema = new Schema({
    skill: {
        type: String,
    },
});

module.exports = Skills = mongoose.model("Skills", SkillSchema);
