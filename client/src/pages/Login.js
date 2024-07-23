import logo from '../logo.svg';
import '../App.css';
import LoginForm from '../components/LoginForm';
import { useEffect } from 'react';
import { basePath } from "../utils/request";

function Login() {
    useEffect(() => {
        localStorage.removeItem("isAuthenticated")
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        fetch(`${basePath}/insertOnce`)
    }, [])
    return (
        <LoginForm />
    );
}

export default Login;
