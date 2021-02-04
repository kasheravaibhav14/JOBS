import Table from 'react-bootstrap/Table'
import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal'
import { Row, Col, Button } from 'react-bootstrap'
import DateTimePicker from 'react-datetime-picker';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default class RecDash extends Component {

    constructor(props) {
        super(props);
        this.state = {
            jobList: [],
            eMApps: 0,
            eMPos: 0,
            eDeadApp: new Date(),
            modalShow: false,
            eJobId: '',
        }
        this.onDelete = this.onDelete.bind(this)
        this.myVerticallyCenteredModal = this.myVerticallyCenteredModal.bind(this)
        this.edit = this.edit.bind(this)
        this.parseTime = this.parseTime.bind(this)
    }

    myVerticallyCenteredModal(props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Opening
              </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label >Max Applicants:</label>
                    <input type="Number" value={this.state.eMApps} onChange={(event) => {
                        this.setState({ eMApps: event.target.value })
                    }} />
                    <label >Max Positions:</label>
                    <input type="Number" value={this.state.eMPos} onChange={(event) => {
                        this.setState({ eMPos: event.target.value })
                    }} />
                    <label >Deadline:</label>
                    <DateTimePicker
                        value={this.state.eDeadApp}
                        onChange={(event) => {
                            this.setState({ eDeadApp: event })
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { this.setState({ modalShow: false }) }}>Cancel</Button>
                    <Button onClick={this.edit}>Edit</Button>
                </Modal.Footer>
            </Modal>
        );
    }
    edit(event) {
        event.preventDefault()
        const editedApp = {
            jobId: this.state.eJobId,
            mApps: this.state.eMApps,
            mPos: this.state.eMPos,
            deadApp: this.state.eDeadApp
        }
        axios.post('http://localhost:4000/jobs/edit', editedApp)
            .then(
                window.location.reload()
            ).catch(e => {
                alert('Edit Failed');
                console.log(e)
            });
    }
    componentDidMount() {
        var uInfo = JSON.parse(localStorage.getItem('userInfo'))
        this.setState({
            recName: uInfo.name,
            recEmail: uInfo.email,
        })
        axios.get('http://localhost:4000/jobs/recGet', {
            params: {
                email: uInfo.email,
            }
        }).
            then(res => {
                var arr = []
                res.data.map((value, index) => {
                    // console.log(value)
                    if (value.mPos > value.acceptedPos)
                        arr.push(value)
                })
                this.setState({
                    jobList: arr,
                })
                console.log(res.data)
            })

    }
    onDelete(event, jobId) {
        event.preventDefault()
        axios.get('http://localhost:4000/jobs/deleteApp', {
            params: {
                jobId
            }
        })
        window.location.reload()
    }
    parseTime(dateTime) {
        var startTime = new Date(dateTime);
        return startTime
    }
    render() {
        const headings = ['Title', 'Max Applications', 'Current Applications', 'Remaining Positions', 'Date of posting', 'Deadline']
        const headingKey = ['title', 'mPos', 'currApps', 'remPos', 'datePos', 'deadApp']
        const jList = [...this.state.jobList]

        return (
            <div>
                <h2>Your Added Openings</h2>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            {
                                headings.map((value, index) => (
                                    <th key={index}>
                                        <div>{value}</div>
                                    </th>
                                ))
                            }
                            <th>xD</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            jList.map((value, index) => (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td><Link to={{ pathname: '/activeApps', state: { id: value._id } }}>{value.title}</Link></td>
                                    <td>{value.mApps}</td>
                                    <td>{value.mPos - value.acceptedPos}</td>
                                    <td>{value.filledPos}</td>
                                    <td>{this.parseTime(value.datePos).toString()}</td>
                                    <td>{this.parseTime(value.deadApp).toString()}</td>
                                    <td><button onClick={(event) => {
                                        this.onDelete(event, value._id)
                                    }} >Delete
                                    </button></td>
                                    <td><button variant="primary" onClick={() => {
                                        this.setState({
                                            modalShow: true,
                                            eJobId: value._id,
                                            eDeadApp: this.parseTime(value.deadApp),
                                            eMApps: value.mApps,
                                            eMPos: value.mPos,
                                        })
                                        console.log(value.deadApp.toString())
                                    }}>Edit
                                    </button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                <this.myVerticallyCenteredModal show={this.state.modalShow} onHide={() => { this.setState({ modalShow: false }) }} />
            </div>
        )
    }

}