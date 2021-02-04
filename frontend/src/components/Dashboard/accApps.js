import Table from 'react-bootstrap/Table'
import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Button } from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown'
import Modal from 'react-bootstrap/Modal'

export default class AccAppDash extends Component {
    constructor() {
        super();
        this.state = {
            sortStat: [],
            prevSort: -1,
            userApps: [],
            recEmail: ''
        }
        this.sortBy = this.sortBy.bind(this)
        this.compareByAsc = this.compareByAsc.bind(this)
        this.compareByDesc = this.compareByDesc.bind(this)
        this.rate = this.rate.bind(this)
    }
    async rate(appEmail, recEmail, rating) {
        const obj = {
            appEmail: appEmail,
            recEmail: recEmail,
            rating: rating,
        }
        await axios.post('http://localhost:4000/jobs/rateAppl', obj)
            .then(res => {
                console.log(res.status)
            }).catch(e => {
                alert('Error');
            });
        window.location.reload()
    }

    sortBy(key, index) {
        let copyAr = [...this.state.modJobList]
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
            modJobList: copyAr
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
        axios.get('http://localhost:4000/jobs/acceptedApplications', {
            params: {
                email: email
            }
        }).then(res => {
            const ar = []
            res.data.map((value, index) => {
                ar.push(value)
            })
            console.log(ar)
            this.setState({
                userApps: ar,
                recEmail: email,
            })
        })
    }


    render() {
        const headings = ['Name', 'Job Title', 'Date of Joining', 'Type of Job']
        const headingKey = ['name', 'jobTitle', 'dateJoin', 'jtype']
        const rating = [1, 2, 3, 4, 5]
        // console.log(headings)
        return (
            <div>
                <h1>My Employees</h1>
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
                            <th>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.userApps.map((value, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{value.name}</td>
                                    <td>{value.jobTitle}</td>
                                    <td>{value.dateJoin}</td>
                                    <td>{value.jtype}</td>
                                    <td>{
                                        !value.ratedBy.includes(this.state.recEmail) ?
                                        <Dropdown>
                                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                "Choose a Rating"
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {rating.map((rat, idx) => {
                                                    return <Dropdown.Item id={idx} eventKey={rat} onSelect={(eventKey) => {
                                                        this.rate(value.appEmail, this.state.recEmail, eventKey)
                                                    }}>{rat}</Dropdown.Item>
                                                })
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>:<div>Already Rated</div>
                                    }
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