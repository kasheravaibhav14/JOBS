import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import Modal from 'react-bootstrap/Modal'

class editProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authState: "",
            userInfo: {},
            email: [],
            skills: [],
            education: [],
            rating: 0,
            name: "",
            jtype: "",
            skillSet: [],
            skillSetLC: [],
            token: "",
            newSkill: "",
            skillsAddToDb: [],
        }
        this.onAddEducation = this.onAddEducation.bind(this);
        this.onDelEducation = this.onDelEducation.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeContact = this.onChangeContact.bind(this);
        this.onChangeBio = this.onChangeBio.bind(this);
        this.handleEdChange = this.handleEdChange.bind(this);
        this.onSubmitRec = this.onSubmitRec.bind(this);
        this.onSubmitApp = this.onSubmitApp.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.removeSkill = this.removeSkill.bind(this);
        this.myVerticallyCenteredModal = this.myVerticallyCenteredModal.bind(this)
        this.addSkillToDb = this.addSkillToDb.bind(this);

    }
    addSkillToDb(event) {
        event.preventDefault()
        if (!(this.state.skillSetLC.includes(this.state.newSkill.toLowerCase()))) {
            // console.log(this.state.newSkill.toLowerCase(), this.state.skillSetLC)
            this.setState({
                skillsAddToDb: [...this.state.skillsAddToDb, this.state.newSkill],
                newSkill: "",
                skillSet: [...this.state.skillSet, this.state.newSkill],
                skillSetLC: [...this.state.skillSetLC, this.state.newSkill.toLowerCase()],
                skills: [...this.state.skills, this.state.newSkill],
            })
        } else {
            alert('Skill Already Exists')
            this.setState({
                modalShow: false
            })
        }
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
                        Add Skill
              </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label >AddnewSkill:</label>
                        <input type="text" value={this.state.newSkill} onChange={(event) => {
                            this.setState({ newSkill: event.target.value })
                        }} /></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { this.setState({ modalShow: false }) }}>Close</Button>
                    <Button onClick={(event) => this.addSkillToDb(event)}>Add</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    removeSkill(event, index) {
        event.preventDefault()
        const skList = [...this.state.skills]
        skList.splice(index, 1)
        this.setState({
            skills: skList
        })
    }

    addSkill(eventKey, event) {
        var ar = [...this.state.skills]
        if (!(eventKey in ar))
            ar.push(eventKey)
        this.setState({
            skills: ar
        })
    }

    onSubmitRec(event) {
        event.preventDefault();
        if (this.state.name == '') {
            alert('Name Cannot be Empty')
            return 1
        }
        if (this.state.bio == '') {
            alert('Bio Cannot be Empty')
            return 1
        }
        if (!this.state.contact.match(/^\d{10}$/)) {
            alert('Invalid Contact Number')
            return 1
        }
        console.log('entered')
        const editedRec = {
            name: this.state.name,
            email: this.state.email,
            contact: this.state.contact,
            bio: this.state.bio,
            token: this.state.token,
        }
        axios.post('http://localhost:4000/RecProfile/edit', editedRec)
            .then(res => {
                if (res.status === 400) {
                    alert('edit failed')
                    // window.location.reload()
                }
                else {
                    alert('edit success')
                }
            })
        window.location = '/profile'

    }

    async onSubmitApp(event) {
        event.preventDefault();
        if (this.state.name == '') {
            alert('Name Cannot be Empty')
            return 1
        }
        const editedRec = {
            name: this.state.name,
            education: this.state.education,
            skills: this.state.skills,
            token: JSON.parse(localStorage.getItem("userInfo")).token,
            email: this.state.email
        }
        await axios.post('http://localhost:4000/AppProfile/edit', editedRec)
            .then(res => {
                if (res.status === 400) {
                    alert('edit failed')
                    // window.location.reload()
                }
                else {
                    alert('edit success')
                }
            })
        await axios.post('http://localhost:4000/skills/add', this.state.skillsAddToDb).then(
            window.location = '/profile'
        )

    }

    onChangeName(event) {
        this.setState({
            name: event.target.value
        });
    }

    onChangeEmail(event) {
        this.setState({
            email: event.target.value
        });
    }

    onChangeContact(event) {
        this.setState({
            contact: event.target.value
        });
    }

    onChangeBio(event) {
        this.setState({
            bio: event.target.value
        });
    }

    handleEdChange(event, index, key) {
        console.log(key)
        const edList = [...this.state.education]
        edList[index][key] = event.target.value
        this.setState({
            education: edList
        })
    }

    componentDidMount() {
        var auth = localStorage.getItem("auth");
        if (auth !== "true") {
            alert('login to continue')
            window.location = "/signIn"
        }
        var uInfo = JSON.parse(localStorage.getItem("userInfo"))
        this.setState({
            authState: localStorage.getItem("auth"),
            userInfo: uInfo,
            email: uInfo.email,
            jtype: uInfo.jtype,
            name: uInfo.name,
            token: uInfo.token,
        });
        if (uInfo.jtype === "jobApplicant") {
            axios.get('http://localhost:4000/AppProfile', {
                params: {
                    token: uInfo.token,
                    email: uInfo.email,
                }
            }).then(response => {
                this.setState({
                    skills: response.data.skills,
                    education: response.data.education,
                    rating: response.data.rating,
                    name: response.data.name,
                    email: response.data.email,
                });
            }).catch(function (error) {
                console.log('F')
            })
            axios.get('http://localhost:4000/skills').then(response => {
                console.log(response.data)
                var skillAr = [], ar1 = []
                response.data.map((value, index) => {
                    skillAr.push(value.skill)
                    ar1.push(value.skill.toLowerCase())
                })
                this.setState({
                    skillSet: skillAr,
                    skillSetLC: ar1
                })
            })

        } else {
            axios.get('http://localhost:4000/RecProfile', {
                params: {
                    token: uInfo.token,
                    email: uInfo.email,
                }
            }).then(response => {
                console.log(response.data)
                this.setState({
                    contact: response.data.contact,
                    bio: response.data.bio,
                });
            }).catch(function (error) {
                console.log('F')
            })
        }
    }
    onAddEducation(event) {
        event.preventDefault()
        this.setState({
            education: [...this.state.education, { "institute": "", "syear": "", "eyear": "" }]
        })

    }
    onDelEducation(index, event) {
        try {
            event.preventDefault()
            var edList = this.state.education.slice(0, this.state.education.length)
            edList.splice(index, 1)
            console.log(edList)
            console.log(index)
            this.setState({
                education: edList
            })
        } catch (e) {
            console.log(e)
        }
    }


    render() {
        return (
            <div>
                <h1>PROFILE</h1>
                { this.state.jtype === "jobApplicant" &&
                    <form onSubmit={this.onSubmitApp}>
                        <div className="form-group">
                            <label>Email: </label>
                            <input type="text"
                                className="form-control"
                                defaultValue={this.state.email}
                                onChange={this.onChangeEmail}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>Name: </label>
                            <input type="text"
                                className="form-control"
                                defaultValue={this.state.name}
                                onChange={this.onChangeName}
                            />
                        </div>
                        <div>
                            Education:
                    {this.state.education.map((value, index) => {
                            return <div key={index}>
                                <Row>
                                    <Col>
                                        <input type="text"
                                            className="form-control"
                                            defaultValue={value.institute}
                                            onChange={e => this.handleEdChange(e, index, 'institute')}
                                        />
                                    </Col>
                                    <Col>
                                        <input type="number"
                                            className="form-control"
                                            defaultValue={value.syear}
                                            onChange={e => this.handleEdChange(e, index, 'syear')}
                                        />
                                    </Col>
                                    <Col>
                                        <input type="number"
                                            className="form-control"
                                            defaultValue={value.eyear}
                                            onChange={e => this.handleEdChange(e, index, 'eyear')}
                                        />
                                    </Col>
                                    <Col>
                                        <button onClick={(event) => {
                                            this.onDelEducation(index, event)
                                        }}>Delete</button>
                                    </Col>
                                </Row>
                            </div>
                        })
                            }
                            <button onClick={this.onAddEducation}>Add</button>
                        </div>
                        <div>
                            <Dropdown>
                                Skills: <br />
                                <Button style={{ paddingRight: "8px" }} onClick={(event) => {
                                    event.preventDefault()
                                    this.setState({ modalShow: true })
                                }}>Add a new Skill</Button>
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
                                {this.state.skills.map((value, index) => {
                                    return (
                                        <Row id={index}>
                                            <Col>
                                                <p>{value}</p>
                                            </Col>
                                            <Col>
                                                <button id={index} onClick={(event) => { this.removeSkill(event, index) }}>Remove</button>
                                            </Col>
                                        </Row>)

                                })}
                            </div>
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Save" className="btn btn-primary" />
                        </div>
                    </form>}
                {
                    this.state.jtype !== "jobApplicant" &&
                    <div>
                        <form onSubmit={this.onSubmitRec}>
                            <div className="form-group">
                                <label>Email: </label>
                                <input type="text"
                                    className="form-control"
                                    defaultValue={this.state.email}
                                    onChange={this.onChangeEmail}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label>Name: </label>
                                <input type="text"
                                    className="form-control"
                                    defaultValue={this.state.name}
                                    onChange={this.onChangeName}
                                />
                            </div>
                            <div className="form-group">
                                <label>Contact </label>
                                <input type="text"
                                    className="form-control"
                                    defaultValue={this.state.contact}
                                    onChange={this.onChangeContact}
                                />
                            </div>
                            <div className="form-group">
                                <label>Bio </label>
                                <input type="text"
                                    className="form-control"
                                    defaultValue={this.state.bio}
                                    onChange={this.onChangeBio}
                                />
                            </div>
                            <div className="form-group">
                                <input type="submit" value="Save" className="btn btn-primary" />
                            </div>
                        </form>
                    </div>
                }
                <this.myVerticallyCenteredModal show={this.state.modalShow} onHide={() => { this.setState({ modalShow: false }) }} />

            </div>
        )
    }
}

export default editProfile;