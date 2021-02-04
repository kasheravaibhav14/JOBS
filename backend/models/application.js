const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ApplicationSchema = new Schema({
    jobId: {
        type: String,
        required: true,
    },
    appEmail: {
        type: String,
        required: true,
    },
    SOP: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Applied"
    },
    dateApp: {
        type: Date,
        required: true
    },
    dateJoin: {
        type: Date,
    },
    hasBeenRated: {
        type: Boolean,
        default: false,
    }

});

module.exports = Applications = mongoose.model("Applications", ApplicationSchema);
