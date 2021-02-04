import Table from 'react-bootstrap/Table'
import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Button } from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown'
import Modal from 'react-bootstrap/Modal'

export default class MyApps extends Component {
    constructor() {
        super();
        this.state = {
            userApps: [],
        }
        this.rate = this.rate.bind(this)
    }
    async rate(appId, jobId, rating) {
        const obj = {
            appId: appId,
            jobId: jobId,
            rating: rating,
        }
        await axios.post('http://localhost:4000/jobs/rateJob', obj)
            .then(res => {
                console.log(res.status)
            }).catch(e => {
                alert('Error');
            });
        window.location.reload()
    }

    componentDidMount() {
        var email = JSON.parse(localStorage.getItem('userInfo')).email
        axios.get('http://localhost:4000/jobs/applications', {
            params: {
                // token: uInfo.token,
                email: email
            }
        }).then(res => {
            const ar = []
            res.data.map((value, index) => {
                ar.push(value)
            })
            this.setState({
                userApps: ar,
            })
        })
    }


    render() {
        const headings = ['Title', 'Date of Joining', 'Recruiter\'s name', 'SalPM', 'Status',]
        const headingKey = ['title', 'dateJoin', 'recName', 'salPM', 'status']
        const rating = [1, 2, 3, 4, 5]
        // console.log(headings)
        return (
            <div>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            {
                                headings.map((value, index) => (
                                    <th key={index}>
                                        <div >{value}</div>
                                    </th>
                                ))
                            }
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.userApps.map((value, index) => (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{value.title}</td>
                                    <td>{value.dateJoin}</td>
                                    <td>{value.recName}</td>
                                    <td>{value.salPM}</td>
                                    <td>{value.status}</td>
                                    {value.status === 'Accepted' && !value.hasRated &&
                                        <Dropdown>
                                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                "Choose a Rating"
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {rating.map((rat, idx) => {
                                                    return <Dropdown.Item id={idx} eventKey={rat} onSelect={(eventKey) => {
                                                        this.rate(value.appId, value.jobId, eventKey)
                                                    }}>{rat}</Dropdown.Item>
                                                })
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    }
                                    {value.hasRated && <p>Rating: {value.rating}</p>}
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        )
    }
}