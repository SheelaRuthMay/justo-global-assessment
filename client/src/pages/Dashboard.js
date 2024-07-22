// External imports
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { basePath } from "../utils/request";
import bcrypt from 'bcryptjs'
// functional component for dashboard page
function Dashboard() {
    let history = useNavigate();
    let token = localStorage.getItem("token");
    const [email, setEmail] = useState(null);
    const [link, setLink] = useState(null);
    const getLink = (event) => {
        event.preventDefault();
        fetch(`${basePath}/getLink/-${bcrypt.hashSync(email, 8).toString().replaceAll('/', '-')}-`)
            .then(res => res.json())
            .then((response) => {
                localStorage.setItem("oneTimeLink", response.message.data.link)
                localStorage.setItem("oneTimeToken", response.message.data.hashedEmail)
                let date = new Date();
                date.setMinutes(date.getMinutes() + response.message.data.timeLimitInMins);
                localStorage.setItem("linkExpires", JSON.stringify(date))
                setLink(response.message.data.link)
                // history(response.message.data.link);
            })
    }

    return (
        <div className="dashboard">
            <form onSubmit={getLink}>
                <input required className="text_input" type="email" placeholder="Enter Email to get One-Time Link" onChange={(e) => setEmail(e.target.value)} />
                <div><button type="submit" className="btn">Get One-Time Link</button></div>
            </form>
            <div>
                {link && (<Link to={link}>{basePath}{link}</Link>)}
            </div>
            <div>
                <button className="btn" onClick={() => { localStorage.clear(); history(`/`) }}>LogOut</button>
            </div>
        </div>
    );
}
// .
export default Dashboard;
