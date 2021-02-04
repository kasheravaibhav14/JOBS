import Table from 'react-bootstrap/Table'
import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Button } from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown'
import emailjs from 'emailjs-com';

export default class RecAppDash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apps: [],
            sortStat: [],
            prevSort: -1,
            jobId: this.props.location.state.id
        }
        this.sortBy = this.sortBy.bind(this)
        this.compareByAsc = this.compareByAsc.bind(this)
        this.compareByDesc = this.compareByDesc.bind(this)
        this.onShortlist = this.onShortlist.bind(this)
        this.onAccept = this.onAccept.bind(this)
        this.onReject = this.onReject.bind(this)
        this.parseTime = this.parseTime.bind(this)
    }
    parseTime(dateTime) {
        var startTime = new Date(dateTime);
        return startTime
    }

    onShortlist(event, appId, jobId) {
        event.preventDefault()
        const obj = {
            appId: appId,
            status: 'Shortlisted',
            jobId: jobId,
        }
        axios.post('http://localhost:4000/jobs/updateAppStat', obj)
            .then(res => {
                if (res.status === 400) {
                    alert('Failed to Shortlist, Try Again!')
                }
                else {
                    alert('Application Shortlisted')

                }
                console.log(appId)
                window.location.reload()
            })
    }

    async onAccept(event, appId, jobId, name, appEmail, recName, jobTitle) {
        event.preventDefault()
        var template = {
            to_name: name,
            from_name: recName,
            email: appEmail,
            message: "Congratulations, you have been accepted into job" + jobTitle
        }
        console.log(template)
        await emailjs.send("service_cou44hg", "template_irrhr82", template, 'user_1O9n6l8iELZcIxN8Guzwc'
        ).then(function (response) {
            console.log('Success', response.text)
        }, function (error) {
            console.log('Failed', error)
        })
        const obj = {
            appId: appId,
            jobId: jobId,
            status: 'Accepted',
        }
        await axios.post('http://localhost:4000/jobs/updateAppStat', obj)
            .then(res => {
                if (res.status === 400) {
                    alert('Failed to Accept, Try Again!')
                }
                else {

                    alert('Application Accepted')
                }
                // console.log(appId)
                window.location.reload()
            })
    }

    onReject(event, appId, jobId) {
        event.preventDefault()
        const obj = {
            appId: appId,
            jobId: jobId,
            status: 'Rejected',
        }
        axios.post('http://localhost:4000/jobs/updateAppStat', obj)
            .then(res => {
                if (res.status === 400) {
                    alert('Failed to Reject, Try Again!')
                }
                else {
                    alert('Application Rejected')
                }
                window.location.reload()
            })
    }

    sortBy(key, index) {
        let copyAr = [...this.state.apps]
        // console.log(this.state.prevSort)
        if (this.state.prevSort !== -1 && index != this.state.prevSort) {
            this.state.sortStat[this.state.prevSort] = 0
        }
        if (this.state.sortStat[index] === 0) {
            this.state.sortStat[index] = 1
        } else if (this.state.sortStat[index] === 1) {
            this.state.sortStat[index] = 2
        } else {
            this.state.sortStat[index] = 1
        }
        this.setState({
            prevSort: index
        });
        var asc = this.state.sortStat[index]
        // console.log(asc, key)
        if (asc == 1) {
            copyAr.sort(this.compareByAsc(key))
        } else {
            copyAr.sort(this.compareByDesc(key))
        }
        console.log(copyAr)
        this.setState({
            apps: copyAr
        })
    }

    compareByAsc(key) {
        return function (x, y) {
            if (x[key] > y[key])
                return 1
            if (x[key] < y[key])
                return -1
            return 0
        }
    }

    compareByDesc(key) {
        return function (x, y) {
            if (x[key] < y[key])
                return 1
            if (x[key] > y[key])
                return -1
            return 0
        }
    }

    componentDidMount() {
        var email = JSON.parse(localStorage.getItem('userInfo')).email
        axios.get('http://localhost:4000/jobs/applicationsPerJob', {
            params: {
                jobId: this.state.jobId
            }
        }).then(res => {
            const ar = []
            res.data.map((value, index) => {
                ar.push(value)
                // console.log(value.name, value.appEmail, value.recName, value.jobTitle)
            })
            console.log(ar)
            this.setState({
                apps: ar,
            })
        })
    }


    render() {
        const headings = ['Name', 'Skills', 'Date of Application', 'Education', 'SOP', 'Rating', 'Stage']
        const headingKey = ['name', 'skills', 'dateApp', 'education', 'SOP', 'rating', 'stage']
        return (
            <div>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            {
                                headings.map((value, index) => (
                                    <th key={index}>
                                        <div onClick={() => this.sortBy(headingKey[index], index)}>{value}</div>
                                    </th>
                                ))
                            }
                            <th>Option1</th>
                            <th>Option2</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.apps.map((value, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{value.name}</td>
                                    <td>{value.skills.toString()}</td>
                                    <td>{this.parseTime(value.dateApp).toString()}</td>
                                    <td>{JSON.stringify(value.education)}</td>
                                    <td>{value.SOP}</td>
                                    <td>{value.rating}</td>
                                    <td>{value.stage}</td>
                                    <td>{
                                        (value.stage === 'Applied' && <button onClick={(event) => {
                                            this.onShortlist(event, value.appId, value.jobId)
                                        }}>Shortlist</button>) ||
                                        (value.stage === 'Shortlisted' && <button onClick={(event) => {
                                            this.onAccept(event, value.appId, value.jobId, value.name, value.appEmail, value.recName, value.jobTitle)
                                        }}>Accept</button>)
                                    }
                                    </td>
                                    <td>{
                                        value.stage !== 'Accepted' &&
                                        <button onClick={(event) => {
                                            this.onReject(event, value.appId, value.jobId)
                                        }}>Reject</button>}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        )
    }
}