import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Button } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'

class Profile extends Component {

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
            contact: "",
            bio: "",
        }
        this.edit = this.edit.bind(this)
    }
    edit(event) {
        event.preventDefault()
        window.location = '/profileEdit'
    }

    componentDidMount() {
        var auth = localStorage.getItem("auth");
        if (auth !== "true") {
            alert('login to continue')
            window.location = "/signIn"
        }
        var uInfo = JSON.parse(localStorage.getItem("userInfo"))
        this.setState({
            authState: auth,
            userInfo: uInfo,
        });
        if (uInfo.jtype === "jobApplicant") {
            axios.get('http://localhost:4000/AppProfile', {
                params: {
                    token: uInfo.token,
                    email: uInfo.email,
                }
            }).then(response => {
                console.log(response.data.rating)
                this.setState({
                    skills: response.data.skills,
                    education: response.data.education,
                    rating: response.data.rating,
                    name: response.data.name,
                    email: response.data.email,
                    jtype: uInfo.jtype
                });
            }).catch(function (error) {
                window.location = '/profileEdit'
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
                    name: response.data.name,
                    email: response.data.email,
                    contact: response.data.contact,
                    jtype: uInfo.jtype,
                    bio: response.data.bio,
                });
            }).catch(function (error) {
                console.log(error)
                window.location = '/profileEdit'
            })
        }
    }


    render() {
        return (
            <div>
                {this.state.jtype === 'jobApplicant' ?
                    // <div>
                    //     Name:{this.state.name}<br />
                    //     email:{this.state.email}<br />
                    //     skills:{this.state.skills}<br />
                    //     <div>
                    //         {
                    //             this.state.education.map((item, index) => {
                    //                 return <div key={index}>
                    //                     {item.institute}
                    //                 </div>
                    //             })
                    //         }
                    //     </div>
                    // </div>
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Education</th>
                                <th>Skills</th>
                                <th>Rating</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {this.state.name}
                                </td>
                                <td>
                                    {this.state.email}
                                </td>
                                <td>
                                    {this.state.education.map((value, index) => {
                                        return <div>
                                            {value.institute}  ({value.syear}-{value.eyear})
                                        </div>
                                    })}
                                </td>
                                <td>
                                    {this.state.skills.map((value, index) => {
                                        return <div>
                                            {value}
                                        </div>
                                    })}
                                </td>
                                <td>
                                    {this.state.rating.toString()}
                                </td>
                                <td>
                                    <button onClick={this.edit}>Edit</button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    :
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Bio</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {this.state.name}
                                </td>
                                <td>
                                    {this.state.email}
                                </td>
                                <td>
                                    {this.state.contact}
                                </td>
                                <td>
                                    {this.state.bio}
                                </td>
                                <td>
                                    <button onClick={this.edit}>Edit</button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                }
            </div>

        )
    }
}

export default Profile;