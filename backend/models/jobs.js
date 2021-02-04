const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const JobSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    recName: {
        type: String,
        required: true,
    },
    recEmail: {
        type: String,
        required: true,
    },
    mApps: {
        type: Number,
        required: true
    },
    mPos: {
        type: Number,
        required: true
    },
    datePos: {
        type: Date,
        // default: Date.now
    },
    deadApp: {
        type: Date,
    },
    reqSkill: [{
        type: String
    }],
    tJob: {
        type: String
    },
    dMon: {
        type: Number,
    },
    salPM: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    filledPos: {
        type: Number,
        default: 0,
    },
    noOfRating: {
        type: Number,
        default: 0,
    },
    acceptedPos: {
        type: Number,
        default: 0
    }

});

module.exports = Jobs = mongoose.model("Jobs", JobSchema);
