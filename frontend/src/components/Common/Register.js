import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            jtype: 'jobApplicant',
            name: '',
            email: '',
            password: '',
            date: null
        }

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangePass = this.onChangePass.bind(this);
    }

    onChangeType(event) {
        this.setState({ jtype: event.target.value });
    }
    onChangeUsername(event) {
        this.setState({ name: event.target.value });
    }

    onChangeEmail(event) {
        this.setState({ email: event.target.value });
    }

    onChangePass(event) {
        this.setState({ password: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        const re = /\S+@\S+\.\S+/
        if (!re.test(this.state.email)) {
            alert('Invalid Email')
            return 1
        }
        if (this.state.password.length < 6) {
            alert('Min Length of Pass is 6 char. Try Again')
            return 1
        }
        if (this.state.name === '') {
            alert('Name cannot be empty')
            return 1
        }
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            date: Date.now(),
            password: this.state.password,
            jtype: this.state.jtype,
        }
        try {
            axios.post('http://localhost:4000/user/register', newUser)
                .then(res => {
                    if (res.data.error != '')
                        alert('User' + res.data.name + 'created. Please Login!!');
                }).catch(e => {
                    alert('User Already exists! Please try again');
                })
                ;
        }
        catch (e) {
            alert(e)
        }

        this.setState({
            jtype: 'jobApplicant',
            name: '',
            email: '',
            password: '',
            date: null
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <label>
                        Are you a Recruiter or an Applicant?:
                        <select value={this.state.jtype} onChange={this.onChangeType}>
                            <option value='jobApplicant'>Job Applicant</option>
                            <option value='recruiter'>Recruiter</option>
                        </select>
                    </label>
                    <div className="form-group">
                        <label>Name: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.name}
                            onChange={this.onChangeUsername}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.email}
                            onChange={this.onChangeEmail}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input type="password"
                            className="form-control"
                            value={this.state.password}
                            onChange={this.onChangePass}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Register" className="btn btn-primary" />
                    </div>
                </form>
                <div>
                    <Link to="/signIn" className="nav-link">Login</Link>
                </div>
            </div>
        )
    }
}