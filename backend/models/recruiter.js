const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const RecruiterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
});

module.exports = Recruiter = mongoose.model("Recruiters", RecruiterSchema);
