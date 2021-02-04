import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
export default class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        }

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangePass = this.onChangePass.bind(this);
    }
    onChangeEmail(event) {
        this.setState({ email: event.target.value });
        console.log(this.state.email, event.target.value)
    }

    onChangePass(event) {
        this.setState({ password: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        const re = /\S+@\S+\.\S+/
        if(!re.test(this.state.email)){
            alert('Invalid Email')
            return 1
        }
        const newUser = {
            email: this.state.email,
            password: this.state.password,
        }
        axios.post('http://localhost:4000/user/login', newUser)
            .then(res => {
                console.log(res.status)
                if (res.data.auth) {
                    alert('Welcome !!');
                    localStorage.setItem('userInfo', JSON.stringify(res.data));
                    localStorage.setItem('auth', "true");
                    window.location.reload();
                    window.location = "/profile";

                }
            }).catch(e => {
                alert('Invalid Credentials! Please try again');
                console.log(e)
                this.setState({
                    email: '',
                    password: '',
                })
            });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
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
                        <input type="submit" value="Login" className="btn btn-primary" />
                    </div>
                </form>
                <div>
                    <Link to="/register" className="nav-link"> Register</Link>
                </div>
            </div>
        )
    }
}