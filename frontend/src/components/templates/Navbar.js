import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

export default class NavBar extends Component {

    constructor() {
        super();
        this.state = {
            authStat: "",
            jtype: "",
        }
    }
    handleClick(event) {
        event.preventDefault();
        localStorage.setItem("auth", "");
        localStorage.setItem("userInfo", "");
        window.location = "/";
    }

    componentDidMount() {
        const auth = localStorage.getItem('auth')
        if (auth === 'true') {
            const jtype = JSON.parse(localStorage.getItem('userInfo')).jtype
            this.setState({
                jtype: jtype
            })
        }
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <Link to="/" className="navbar-brand">JOBS</Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                            {
                                this.state.jtype === 'recruiter' &&
                                <li className="navbar-item">
                                    <Link to="/dashView" className="nav-link">Dashboard</Link>
                                </li>
                            }
                            {
                                this.state.jtype === 'recruiter' &&
                                <li className="navbar-item">
                                    <Link to="/accApps" className="nav-link">Employees</Link>
                                </li>
                            }
                            {
                                this.state.jtype === 'jobApplicant' &&
                                <li className="navbar-item">
                                    <Link to="/myApps" className="nav-link">Dashboard</Link>
                                </li>
                            }
                            {
                                localStorage.getItem("auth") !== "true" ? (
                                    <li className="navbar-item">
                                        <Link to="/signIn" className="nav-link">Login</Link>
                                    </li>) : null
                            }
                            {
                                localStorage.getItem("auth") === "true" ? (
                                    <li className="navbar-item">
                                        <Link to="#" className="nav-link" onClick={this.handleClick}>Logout</Link>
                                    </li>) : null
                            }
                            {
                                <li className="navbar-item">
                                    <Link to="/profile" className="nav-link">My Profile</Link>
                                </li>
                            }
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}