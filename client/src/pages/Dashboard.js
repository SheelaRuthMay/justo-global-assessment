// External imports
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { basePath } from "../utils/request";
import bcrypt from 'bcryptjs'
// functional component for dashboard page
function Dashboard() {
    let history = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [role, setRole] = useState(localStorage.getItem("role"))
    const [email, setEmail] = useState(null);
    const [link, setLink] = useState(null);
    const [time, setTime] = useState(null);
    const [decodedToken, setDecodedToken] = useState(null);
    const [users, setUsers] = useState([]);
    const [adminError, setAdminError] = useState(null);
    const getLink = (event) => {
        setLink(null)
        event.preventDefault();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        fetch(`${basePath}/getLink/-${bcrypt.hashSync(email, 8).toString().replaceAll('/', '-')}-`, { headers })
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

    const getTime = () => {
        setTime(null)
        setDecodedToken(null)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        fetch(`${basePath}/getTime`, { headers })
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    setTime(data.message.currentTime);
                    setDecodedToken(JSON.stringify(data.message.decoded));
                }
                else {
                    setTime(data.message)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const getAllUsers = () => {
        if (role === 'admin') {
            fetch(`${basePath}/getAllUsers`)
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        console.log(data, data.message.data)
                        setUsers(data.message.data);
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    useEffect(() => {
        getAllUsers()

    }, [role]);

    const kickOut = (id) => {
        fetch(`${basePath}/kickOut/${id}`, {
            method: "PATCH"
        }).then(res => res.json())
            .then(response => {
                if (response.status) {
                    getAllUsers()
                }
                else {
                    setAdminError(response.message.id)
                }
            })
    }

    return (
        <div className="dashboard">
            <form onSubmit={getLink}>
                <input required className="text_input" type="email" placeholder="Enter Email to get One-Time Link" onChange={(e) => setEmail(e.target.value)} />
                <div><button type="submit" className="btn">Get One-Time Link</button></div>
            </form>

            <div><button onClick={getTime} className="btn">Get Time</button></div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>One-Time Link</th>
                            <th>Current Server Time</th>
                            <th>Decoded Token</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{link && (<Link to={link}>{basePath}{link}</Link>)}</td>
                            <td>{time}</td>
                            <td>{decodedToken}</td>
                        </tr>
                    </tbody>
                </table>

            </div>
            {role === 'admin' && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Status</th>
                                <th>Kick Out</th>
                            </tr>
                        </thead>
                        <tbody>

                            {users && users.map((el, i) => {
                                return (
                                    <tr>
                                        <td>{el.username}</td>
                                        <td>{el.kickedOut ? "Kicked-Out" : "Active"}</td>
                                        <td><button onClick={() => kickOut(el.id)} disabled={el.kickedOut}>Kick Out</button><br />
                                            {adminError === el.id && "Unable to Kick Out"}</td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                </div>
            )}
            <div>
                <button className="btn" onClick={() => { localStorage.clear(); history(`/`) }}>LogOut</button>
            </div>
        </div>
    );
}
// .
export default Dashboard;
