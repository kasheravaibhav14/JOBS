var express = require("express");
const skills = require("../models/skills");
var router = express.Router();
const mongodb = require('mongodb')
// Load User model
const Jobs = require("../models/jobs")
const Applications = require("../models/application");
const { Mongoose } = require("mongoose");
const Applicant = require('../models/applicant')

router.get("/", function (req, res) {
    Jobs.find(function (err, jobs) {
        if (err)
            console.log(err)
        else
            res.send(jobs)
    })
});

router.get("/recGet", function (req, res) {
    var email = req.query.email
    Jobs.find(function (err, jobs) {
        let arr = []
        if (err)
            console.log(err)
        else {
            jobs.map((value, index) => {
                if (value.recEmail === email) {
                    arr.push(value)
                }
            })
            res.send(arr)
        }
    })
});

router.get("/applications", function (req, res) {
    var email = req.query.email
    Applications.find(async function (err, apps) {
        let arr = []
        if (err)
            console.log(err)
        else {
            const array = await Promise.all(apps.map(async function (value, index) {
                if (value.appEmail === email) {
                    console.log(value)
                    const obj = await Jobs.findOne({ _id: mongodb.ObjectId(value.jobId) })
                    arr.push({
                        title: obj['title'],
                        dateJoin: value.dateJoin,
                        appId: value._id,
                        jobId: value.jobId,
                        recName: obj['recName'],
                        salPM: obj['salPM'],
                        status: value.status,
                        hasRated: value.hasBeenRated,
                        rating: obj['rating'],
                        filledPos: obj['filledPos'],
                        maxPos: obj['mPos'],
                        maxApps: obj['mApps'],
                        acceptedPos: obj['acceptedPos'],
                    })
                }
                // console.log(arr)
            }));
            // console.log(array)
            console.log(arr)
            res.send(arr)
        }
    })
});

router.get("/acceptedApplications", function (req, res) {
    // var email = req.query.email
    var recEmail = req.query.email
    Applications.find(async function (err, apps) {
        let arr = []
        if (err)
            console.log(err)
        else {
            const array = await Promise.all(apps.map(async function (value, index) {
                if (value.status !== 'Rejected') {
                    const appObj = await Applicant.findOne({ email: value.appEmail })
                    const jobObj = await Jobs.findOne({ _id: mongodb.ObjectId(value.jobId) })
                    if (jobObj.recEmail === recEmail && value.status === 'Accepted') {
                        console.log(value)
                        arr.push({
                            name: appObj['name'],
                            dateJoin: value['dateJoin'],
                            jtype: jobObj['tJob'],
                            jobId: value.jobId,
                            appId: value._id,
                            SOP: value.SOP,
                            jobTitle: jobObj['title'],
                            ratedBy: appObj.ratedBy,
                            appEmail: value.appEmail,
                        })
                    }
                }
            }));
            console.log(arr)
            res.send(arr)
        }
    })
});

router.get("/applicationsPerJob", function (req, res) {
    // var email = req.query.email
    var jobId = req.query.jobId
    Applications.find(async function (err, apps) {
        let arr = []
        if (err)
            console.log(err)
        else {
            const array = await Promise.all(apps.map(async function (value, index) {
                // console.log(value.jobId, jobId)
                if (value.jobId === jobId && value.status != 'Rejected') {
                    // console.log(value)
                    const obj = await Applicant.findOne({ email: value.appEmail })
                    const objJob = await Jobs.findOne({ _id: mongodb.ObjectId(jobId) })
                    arr.push({
                        name: obj['name'],
                        skills: obj['skills'],
                        jobId: value.jobId,
                        appId: value._id,
                        SOP: value.SOP,
                        education: obj['education'],
                        rating: obj['rating'],
                        dateApp: value.dateApp,
                        stage: value.status,
                        appEmail: obj['email'],
                        recName: objJob['recName'],
                        jobTitle: objJob['title']
                    })
                }
            }));
            // console.log(arr)
            res.send(arr)
        }
    })
});

router.post("/rateJob", async function (req, res) {
    var appId = req.body.appId
    var rating = req.body.rating
    var jobId = req.body.jobId
    await Applications.findOneAndUpdate({ _id: mongodb.ObjectId(appId) }, { hasBeenRated: true }, { useFindAndModify: false, new: true }, function (err, result) {
        if (err)
            return res.status(400).send(err)
        console.log(result)
    })
    var appD = await Jobs.findOne({ _id: mongodb.ObjectId(jobId) })
    var newRating = (appD.rating * appD.noOfRating + rating) / (appD.noOfRating + 1)
    console.log(newRating)
    await Jobs.findOneAndUpdate({ _id: mongodb.ObjectId(jobId) }, { rating: newRating, noOfRating: appD.noOfRating + 1 }, { useFindAndModify: false, new: true }, function (err, result) {
        if (err)
            return res.status(400).send(err)
        else
            return res.status(200).send(result)
    })
})

router.post("/rateAppl", async function (req, res) {
    var appEmail = req.body.appEmail
    var rating = req.body.rating
    var recId = req.body.recEmail
    var appD = await Applicant.findOne({ email: appEmail })
    var newRating = ((appD.rating * appD.nRatings) + rating) / (appD.nRatings + 1)
    var ratedBy = appD.ratedBy
    ratedBy.push(recId)
    console.log(newRating)
    await Applicant.findOneAndUpdate({ email: appEmail }, { rating: newRating, nRatings: appD.nRatings + 1, ratedBy: ratedBy }, { useFindAndModify: false, new: true }, function (err, result) {
        if (err)
            return res.status(400).send(err)
        else
            return res.status(200).send(result)
    })
})

router.post("/updateAppStat", async function (req, res) {
    var id = req.body.appId
    var newStat = req.body.status
    var jobId = req.body.jobId
    // console.log(id, newStat)
    var appEmail
    await Applications.findOneAndUpdate({ _id: mongodb.ObjectId(id) }, { status: newStat }, { useFindAndModify: false, new: true }, function (err, result) {
        if (err) {
            return res.status(400)
        }
        else {
            appEmail = result.appEmail
            if (newStat !== 'Accepted')
                return res.status(200).send(result)
        }
    });
    console.log(appEmail, id, jobId)
    if (newStat === 'Accepted') {
        var date = new Date()
        var obj = await Jobs.findOne({ _id: mongodb.ObjectId(jobId) })
        await Jobs.findOneAndUpdate({ _id: mongodb.ObjectId(jobId) }, { acceptedPos: obj.acceptedPos + 1 }, { useFindAndModify: false, new: true }, function (err, result) {
            if (err) {
                return res.status(400)
            }
        });
        await Applications.find(async function (err, apps) {
            let arr = []
            if (err)
                console.log(err)
            else {
                const array = await Promise.all(apps.map(async function (value, index) {
                    if (value.appEmail === appEmail && value._id != id) {
                        console.log(value)
                        await Applications.findByIdAndUpdate({ _id: mongodb.ObjectId(value._id) }, { status: 'Rejected' }, { useFindAndModify: false, new: true }, function (err, result) {
                            if (err)
                                console.log(err)
                        });
                    } else if (value._id == id) {
                        await Applications.findByIdAndUpdate({ _id: mongodb.ObjectId(value._id) }, { dateJoin: date, isAccepted: true }, { useFindAndModify: false, new: true }, function (err, result) {
                            if (err)
                                console.log(err)
                        });
                    }
                    if (value.status == 'Applied' || value.status == 'Shortlisted') {
                        await Applications.findByIdAndUpdate({ _id: mongodb.ObjectId(value._id) }, { status: 'Rejected' }, { useFindAndModify: false, new: true }, function (err, result) {
                            if (err)
                                console.log(err)
                        });
                    }
                }));
                res.send(arr)
            }
        })
    }
})

router.post("/apply", async function (req, res) {
    const newApp = new Applications({
        jobId: req.body.jobId,
        appEmail: req.body.email,
        SOP: req.body.SOP,
        dateApp: new Date()
    });
    console.log('xD')
    var jobD = await Jobs.findOne({ _id: mongodb.ObjectId(req.body.jobId) })
    await Jobs.findOneAndUpdate({ _id: mongodb.ObjectId(req.body.jobId) },
        { filledPos: jobD.filledPos + 1 }, { new: true, useFindAndModify: false }, function (err, doc) {
            if (err) {
                console.log(err)
                return res.status(400).send(err)
            }
        })
    // var appD = await Applicant.findOne({ email: req.body.email })
    // await Applicant.findOneAndUpdate({ email: req.body.email },
    //     { appNo: appD.appNo + 1 }, { new: true, useFindAndModify: false }, function (err, doc) {
    //         if (err) {
    //             console.log(err)
    //             return res.status(400).send(err)
    //         }
    //     })
    newApp.save().then(newAppl => {
        return res.status(200).json(newAppl)
    }).catch(error => {
        console.log(error)
        return res.status(400).send(error)
    })

})

router.get("/deleteApp", async function (req, res) {
    var jobId = req.query.jobId
    Jobs.find(async function (err, jobs) {
        if (err) {
            return res.status(400)
        } else {
            await Jobs.deleteOne({ _id: mongodb.ObjectId(jobId) }, (err, results) => {
                if (err)
                    res.status(400).send(err)
            })
            await Applications.deleteMany({ jobId: jobId }, (err, res) => {
                if (err)
                    console.log(err)
                else
                    console.log(res)
            })
        }
    })
});

router.post("/add", (req, res) => {
    var date = new Date()
    const newjob = new Jobs({
        title: req.body.title,
        mApps: req.body.mApps,
        mPos: req.body.mPos,
        recName: req.body.recName,
        recEmail: req.body.recEmail,
        deadApp: req.body.deadApp,
        datePos: date,
        reqSkill: req.body.reqSkill,
        tJob: req.body.tJob,
        dMon: req.body.dMon,
        salPM: req.body.salPM,
        rating: req.body.rating,
        filledPos: 0,
    });
    newjob.save().then(newJ => {
        return res.json(newJ);
    }).catch(error => {
        console.log(error)
        return res.status(400).send(error)
    });
});

router.post("/edit", (req, res) => {
    var jobId = req.body.jobId
    Jobs.findOneAndUpdate({ _id: mongodb.ObjectId(jobId) },
        { deadApp: req.body.deadApp, mPos: req.body.mPos, mApps: req.body.mApps }, { new: true, useFindAndModify: false }, function (err, doc) {
            if (err)
                console.log(err)
        })

});

module.exports = router;
