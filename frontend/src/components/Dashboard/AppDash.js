import Table from 'react-bootstrap/Table'
import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Button } from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown'
import Modal from 'react-bootstrap/Modal'

export default class AppDash extends Component {
    constructor() {
        super();
        this.state = {
            modJobList: [],
            jobList: [],
            sortStat: [],
            prevSort: -1,
            searchVal: '',
            typeFilter: 'All',
            dMon: 7,
            minSal: 0,
            maxSal: 1e9,
            modalShow: false,
            jobIdx: null,
            SOP: '',
            userApps: [],
            activeApps: 0,
            hasBeenAccepted: false,
        }
        this.sortBy = this.sortBy.bind(this)
        this.compareByAsc = this.compareByAsc.bind(this)
        this.compareByDesc = this.compareByDesc.bind(this)
        this.onChangeSearch = this.onChangeSearch.bind(this)
        this.onSelectFilterType = this.onSelectFilterType.bind(this)
        this.onFilter = this.onFilter.bind(this)
        this.onSelectDMon = this.onSelectDMon.bind(this)
        this.onChangeMinSal = this.onChangeMinSal.bind(this)
        this.onChangeMaxSal = this.onChangeMaxSal.bind(this)
        this.myVerticallyCenteredModal = this.myVerticallyCenteredModal.bind(this)
        this.apply = this.apply.bind(this)
        this.parseTime = this.parseTime.bind(this)
        this.presentDT = this.presentDT.bind(this)
    }
    presentDT() {
        var dt = new Date();
        return dt.getTime();
    }
    parseTime(dateTime) {
        var startTime = new Date(dateTime);
        return startTime
    }

    apply(event) {
        event.preventDefault()
        var a = this.state.SOP.split(' ').length
        if (a > 250) {
            alert('SOP more than 250 words')
            return 1
        }
        if (this.state.SOP.length < 1) {
            alert('SOP cannot be empty')
            return 1
        }
        var idx = this.state.jobIdx.index
        console.log(idx)
        console.log(this.state.modJobList[idx]._id)
        const newAppl = {
            SOP: this.state.SOP,
            jobId: this.state.modJobList[idx]._id,
            email: JSON.parse(localStorage.getItem('userInfo')).email
        }
        axios.post('http://localhost:4000/jobs/apply', newAppl)
            .then(res => {
                console.log(res.status)
                window.location.reload()
            })
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
                        Apply to job
              </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.activeApps < 10 ?
                        <div>
                            <label >SOP:</label>
                            <input type="text" value={this.state.SOP} onChange={(event) => {
                                this.setState({ SOP: event.target.value })
                            }} /></div> : <p>
                            Maximum number of Applied Applications Reached
                    </p>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { this.setState({ modalShow: false }) }}>Close</Button>
                    {this.state.activeApps < 10 &&
                        <Button onClick={this.apply}>Apply</Button>
                    }
                </Modal.Footer>
            </Modal>
        );
    }

    onFilter(searchVal, typeFilter, dMon, minSal, maxSal) {
        var tempList = []
        var jobList = [...this.state.jobList]
        jobList.map((value, index) => {
            if (value.title.search(searchVal) != -1 || searchVal == '') {
                if (value.dMon < dMon && (value.salPM >= minSal && value.salPM <= maxSal))
                    tempList.push(value)
            }
        })
        let copyAr = []
        switch (typeFilter) {
            case 'All':
                copyAr = [...tempList]
                break;

            case 'WFH':
                tempList.map((value, index) => {
                    if (value.tJob === 'WFH')
                        copyAr.push(value)
                })
                break;

            case 'FT':
                tempList.map((value, index) => {
                    if (value.tJob === 'FT')
                        copyAr.push(value)
                })
                break;
            case 'PT':
                tempList.map((value, index) => {
                    if (value.tJob === 'PT')
                        copyAr.push(value)
                })
                break;
            default:
                break;
        }
        this.setState({
            modJobList: copyAr
        })
    }

    onChangeSearch(event) {
        this.setState({
            searchVal: event.target.value
        })
        this.onFilter(event.target.value, this.state.typeFilter, this.state.dMon, this.state.minSal, this.state.maxSal)
    }

    onChangeMinSal(event) {
        this.setState({
            minSal: event.target.value
        })
        this.onFilter(this.state.searchVal, this.state.typeFilter, this.state.dMon, event.target.value, this.state.maxSal)
    }
    onChangeMaxSal(event) {
        this.setState({
            maxSal: event.target.value
        })
        this.onFilter(this.state.searchVal, this.state.typeFilter, this.state.dMon, this.state.minSal, event.target.value)
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
    onSelectFilterType(eventKey) {
        this.setState({
            typeFilter: eventKey
        })
        console.log(eventKey, this.state.typeFilter)
        this.onFilter(this.state.searchVal, eventKey, this.state.dMon, this.state.minSal, this.state.maxSal)
    }

    onSelectDMon(eventKey) {
        this.setState({
            dMon: eventKey
        })
        this.onFilter(this.state.searchVal, this.state.typeFilter, eventKey, this.state.minSal, this.state.maxSal)
    }

    async componentDidMount() {
        var jobs = []
        await axios.get('http://localhost:4000/jobs').
            then(res => {
                res.data.map((value, index) => {
                    // console.log(this.parseTime(value.deadApp).getTime(), this.presentDT())
                    if (this.parseTime(value.deadApp).getTime() > this.presentDT())
                        jobs.push(value)
                })
                this.setState({
                    jobList: jobs,
                    modJobList: jobs,
                })
                console.log(res.data)
            })
        var i = 0
        while (i < 8) {
            this.state.sortStat.push(0)
            i += 1
        }
        var email = JSON.parse(localStorage.getItem('userInfo')).email
        await axios.get('http://localhost:4000/jobs/applications', {
            params: {
                // token: uInfo.token,
                email: email
            }
        }).then(res => {
            const ar = []
            var count = 0, acc = false
            res.data.map((value, index) => {
                ar.push(value.jobId)
                if (value.status != 'Rejected')
                    count++
                if (value.status == 'Accepted')
                    acc = true

            })
            this.setState({
                userApps: ar,
                activeApps: count,
                hasBeenAccepted: acc
            })
            console.log(count)
        })
    }


    render() {
        const headings = ['Title', 'Req Skills', 'tJob', 'dMon', 'SalPM', 'rating', 'max Positions', 'Deadline',]
        const headingKey = ['title', 'reqSkill', 'tJob', 'dMon', 'salPM', 'rating', 'mPos', 'deadApp']
        const months = [1, 2, 3, 4, 5, 6, 7]
        // console.log(headings)
        return (
            <div>
                <div style={{ padding: "10px" }}>
                    Search By Title:{'\t'}
                    <input type="text" value={this.state.searchVal} onChange={this.onChangeSearch} />
                </div>
                <div style={{ padding: "10px" }}>
                    <Dropdown>
                        Type of Job: {'\t'}
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {this.state.typeFilter}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="All" onSelect={(eventKey, event) => {
                                this.onSelectFilterType(eventKey, event)
                            }}>All</Dropdown.Item>
                            <Dropdown.Item eventKey="WFH" onSelect={(eventKey, event) => {
                                this.onSelectFilterType(eventKey, event)
                            }}>WFH</Dropdown.Item>
                            <Dropdown.Item eventKey="PT" onSelect={(eventKey, event) => {
                                this.onSelectFilterType(eventKey, event)
                            }}>PT</Dropdown.Item>
                            <Dropdown.Item eventKey="FT" onSelect={(eventKey, event) => {
                                this.onSelectFilterType(eventKey, event)
                            }}>FT</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div style={{ padding: "10px" }}>
                    <Dropdown>
                        Maximum Duration : {'\t'}
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {this.state.dMon}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {
                                months.map((value, index) => {
                                    return <Dropdown.Item eventKey={value} onSelect={(eventKey, event) => {
                                        this.onSelectDMon(eventKey, event)
                                    }}>{value}</Dropdown.Item>
                                })
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div>
                    <Row>
                        <Col>
                            <div style={{ padding: "10px" }}>
                                Enter Min Sal:{'\t'}
                                <input type="number" value={this.state.minSal} onChange={this.onChangeMinSal} />
                            </div>
                        </Col>
                        <Col>
                            <div style={{ padding: "10px" }}>
                                Enter Max Sal:{'\t'}
                                <input type="number" value={this.state.maxSal} onChange={this.onChangeMaxSal} />
                            </div>
                        </Col>
                    </Row>
                </div>
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
                            <th>Apply</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.modJobList.map((value, index) => (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{value.title}</td>
                                    <td>{value.reqSkill.toString()}</td>
                                    <td>{value.tJob}</td>
                                    <td>{value.dMon}</td>
                                    <td>{value.salPM}</td>
                                    <td>{value.rating}</td>
                                    <td>{value.mPos}</td>
                                    <td>{this.parseTime(value.deadApp).toString()}</td>
                                    <td>{(value.acceptedPos < value.mPos && value.filledPos < value.mApps && !this.state.hasBeenAccepted) ?
                                        (!this.state.userApps.includes(value._id)) ?
                                            <button variant="primary" onClick={() => {
                                                if (this.state.activeApps < 10) {
                                                    console.log(this.state.activeApps)
                                                    this.setState({
                                                        modalShow: true,
                                                        jobIdx: { index }
                                                    })
                                                } else {
                                                    alert('Maximum Number of Applications reached')
                                                }
                                            }}
                                                style={
                                                    { backgroundColor: "white" }
                                                }>Apply
                                    </button> : <p style={
                                                { backgroundColor: "green", padding: "5px" }
                                            }>Applied</p> :
                                        (this.state.hasBeenAccepted ? <p>Already Accepted Into a Job</p> : (!this.state.userApps.includes(value._id) ? <p style={
                                            { backgroundColor: "cyan", padding: "5px" }
                                        }>Full</p> : <p style={
                                            { backgroundColor: "purple", padding: "5px" }
                                        }>Applied</p>))
                                    }

                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                <this.myVerticallyCenteredModal show={this.state.modalShow} onHide={() => { this.setState({ modalShow: false }) }} />
            </div >
        )
    }
}