import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import AppDash from '../Dashboard/AppDash'
import RecDash from '../Dashboard/RecDash';
import AddJob from '../Dashboard/addJob'
export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            jtype: '',
        }
    }
    componentDidMount() {
        var authStat = localStorage.getItem("auth")
        if (authStat !== "true") {
            window.location = '/signIn'
        }
        var uInfo = JSON.parse(localStorage.getItem("userInfo"))
        this.setState({
            jtype: uInfo.jtype,
            name: uInfo.name,
            email: uInfo.email
        })
        console.log(uInfo.jtype)
    }

    render() {
        console.log(this.state)
        return (
            <div>
                <h1>Welcome to JOBS</h1>
                {
                    this.state.jtype === "jobApplicant" ?
                        <div>
                            <AppDash />
                        </div>
                        : <div>
                            <AddJob />
                        </div>
                }
            </div>
        )
    }
}