const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const ApplicantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    education: [],
    rating: {
        type: Number,
        required: true,
    },
    nRatings: {
        type: Number,
        default: 0,
    },
    skills: [{
        type: String,
    }],
    ratedBy: [{
        type: String,
    }],
    isAccepted: {
        type: Boolean,
        default: false
    },
    dateJoin:{
        type: Date,
    }
});

module.exports = Applicant = mongoose.model("Applicants", ApplicantSchema);
