import Table from 'react-bootstrap/Table'
import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Button } from 'react-bootstrap'
import DateTimePicker from 'react-datetime-picker';
import Dropdown from 'react-bootstrap/Dropdown'

export default class AddJob extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            mApps: 0,
            mPos: 0,
            recName: "",
            recEmail: "",
            reqSkill: [],
            tJob: "",
            dMon: 0,
            salPM: 0,
            rating: "",
            deadApp: new Date(),
            skillSet: [],
            typeFilter: 'WFH',
        }
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangemaxApps = this.onChangemaxApps.bind(this);
        this.onChangemaxPos = this.onChangemaxPos.bind(this);
        this.onChangesalPM = this.onChangesalPM.bind(this);
        this.onChangeRating = this.onChangeRating.bind(this);
        this.onChangedMon = this.onChangedMon.bind(this);
        this.onChangeDead = this.onChangeDead.bind(this);
        this.onSelectFilterType = this.onSelectFilterType.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.addSkill = this.addSkill.bind(this)
        this.removeSkill = this.removeSkill.bind(this);

    }
    removeSkill(event, index) {
        event.preventDefault()
        const skList = [...this.state.reqSkill]
        skList.splice(index, 1)
        this.setState({
            reqSkill: skList
        })
    }

    addSkill(eventKey, event) {
        if (!this.state.reqSkill.includes(eventKey))
            this.setState({
                reqSkill: [...this.state.reqSkill, eventKey]
            })
    }
    onSelectFilterType(eventKey) {
        this.setState({
            typeFilter: eventKey
        })
    }
    onChangeDead(event) {
        console.log(event)
        this.setState({
            deadApp: event
        });
    }

    onChangeTitle(event) {
        this.setState({
            title: event.target.value
        });
    }

    onChangemaxApps(event) {
        this.setState({
            mApps: event.target.value
        });
    }

    onChangemaxPos(event) {
        this.setState({
            mPos: event.target.value
        });
    }

    onChangedMon(event) {
        this.setState({
            dMon: event.target.value
        });
    }

    onChangesalPM(event) {
        this.setState({
            salPM: event.target.value
        });
    }

    onChangeRating(event) {
        this.setState({
            rating: event.target.value
        });
    }
    onSubmit(event) {
        event.preventDefault()
        if (this.state.title.length < 1) {
            alert('Title cannot be empty')
            return 1
        }
        if (this.state.dMon < 0 || this.state.dMon > 7) {
            alert('Months range between 0-7')
            return 1
        }
        if (this.state.salPM < 0) {
            alert('Salary must be a positive integer')
            return 1
        }
        const Job = {
            title: this.state.title,
            mApps: this.state.mApps,
            mPos: this.state.mPos,
            recName: this.state.recName,
            recEmail: this.state.recEmail,
            deadApp: this.state.deadApp,
            reqSkill: this.state.reqSkill,
            tJob: this.state.typeFilter,
            dMon: this.state.dMon,
            salPM: this.state.salPM,
            rating: 0,
        }
        console.log(Job)
        axios.post('http://localhost:4000/jobs/add', Job)
            .then(res => {
                console.log(res.status)
                alert('New Job Added');
                window.location.reload();
            }).catch(e => {
                alert('Error Occurred!');
                console.log(e)
                // window.location.reload();
            });
    }

    componentDidMount() {
        var uInfo = JSON.parse(localStorage.getItem('userInfo'))
        this.setState({
            recName: uInfo.name,
            recEmail: uInfo.email,
        })
        axios.get('http://localhost:4000/skills').then(response => {
            console.log(response.data)
            var skillAr = []
            response.data.map((value, index) => {
                skillAr.push(value.skill)
            })
            this.setState({
                skillSet: skillAr,
            })
        })
    }
    render() {
        return (
            <div>
                <h1>Add a New Opening</h1>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Title: </label>
                        <input type="text"
                            className="form-control"
                            defaultValue={this.state.title}
                            onChange={this.onChangeTitle}
                        />
                    </div>
                    <Row>
                        <Col>
                            <div className="form-group">
                                <label>Duration in Months: </label>
                                <input type="number"
                                    className="form-control"
                                    defaultValue={this.state.dMon}
                                    onChange={this.onChangedMon}
                                />
                            </div>
                        </Col>
                        <Col>
                            <div className="form-group">
                                <label>Salary per Month: </label>
                                <input type="number"
                                    className="form-control"
                                    defaultValue={this.state.salPM}
                                    onChange={this.onChangesalPM}
                                />
                            </div>
                        </Col>
                        {/* <Col>
                            <div className="form-group">
                                <label>Rating: </label>
                                <input type="number"
                                    className="form-control"
                                    defaultValue={this.state.rating}
                                    onChange={this.onChangeRating}
                                />
                            </div>
                        </Col> */}
                        <Col>
                            <div className="form-group">
                                <label>Maximum Positions: </label>
                                <input type="number"
                                    className="form-control"
                                    defaultValue={this.state.mPos}
                                    onChange={this.onChangemaxPos}
                                />
                            </div>
                        </Col>
                        <Col>
                            <div className="form-group">
                                <label>Maximum Applications: </label>
                                <input type="number"
                                    className="form-control"
                                    defaultValue={this.state.mApps}
                                    onChange={this.onChangemaxApps}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div>
                                <label>Choose Deadline of Application :</label>
                                <DateTimePicker
                                    value={this.state.deadApp}
                                    onChange={this.onChangeDead}
                                />
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <Dropdown>
                                    Type of Job: {'\t'}
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        {this.state.typeFilter}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
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
                        </Col>
                    </Row>
                    <div style={{ paddingTop: "8px", paddingBottom: "8px" }}>
                        <Dropdown>
                            Skills: <br />
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                "Choose Skill"
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {this.state.skillSet.map((value, index) => {
                                    return <Dropdown.Item id={index} eventKey={value} onSelect={(eventKey, event) => {
                                        this.addSkill(eventKey, event)
                                    }}>{value}</Dropdown.Item>
                                })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        <div>
                            {
                                this.state.reqSkill.map((value, index) => {
                                    return (
                                        <Row id={index}>
                                            <Col>
                                                <p>{value}</p>
                                            </Col>
                                            <Col>
                                                <button id={index} onClick={(event) => { this.removeSkill(event, index) }}>Remove</button>
                                            </Col>
                                        </Row>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Submit" className="btn btn-primary" />
                    </div>
                </form>
            </div>)
    }
}