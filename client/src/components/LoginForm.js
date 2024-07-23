import react, { useState } from 'react';
import { basePath } from "../utils/request";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
    let history = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const handleSubmit = (event) => {
        setError(null)
        event.preventDefault();
        fetch(`${basePath}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        }).then(res => res.json())
            .then((response) => {
                if (response.status) {
                    localStorage.setItem("isAuthenticated", true)
                    localStorage.setItem("role", response.message.role)
                    localStorage.setItem("token", response.message.accessToken)
                    history(`/dashboard`);
                }
                else {
                    setError(response.message)
                }
            }).catch((err) => {
                console.log(err)
            })
    }


    return (
        <div className="login">
            <h4>Login</h4>
            <b className="error">{error}</b>
            <form onSubmit={handleSubmit}>
                <div className="text_area">
                    <input
                        type="text"
                        required
                        id="username"
                        name="username"
                        placeholder="username"
                        className="text_input"
                        onChange={(e) => setUsername(e.target.value)}

                    />
                </div>
                <div className="text_area">
                    <input
                        type="password"
                        required
                        min={5}
                        max={10}
                        id="password"
                        name="password"
                        placeholder="password"
                        className="text_input"
                        onChange={(e) => setPassword(e.target.value)}

                    />
                </div>
                <input
                    type="submit"
                    value="LOGIN"
                    className="btn"
                />
            </form>
        </div>
    )
}

export default LoginForm;