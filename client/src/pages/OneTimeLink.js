import logo from '../logo.svg';
import '../App.css';
import LoginForm from '../components/LoginForm';
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { basePath } from '../utils/request';

function OneTimeLink() {
    const [data, setData] = useState(true)
    useEffect(() => {
        let date = new Date();
        if (date > new Date(JSON.parse(localStorage.getItem('linkExpires')))) {
            setData(false);
        }
        else {
            // setData(true)
            fetch(`${basePath}/updateLinkTime/${localStorage.getItem('oneTimeToken')}`).then((res) => res.json())
                .then((response) => {
                    setData(response.message.data.status)
                })
        }
    }, [])
    return (
        <div className='oneTimeLink'>
            {data ? localStorage.getItem('oneTimeToken') : "Link Expired"}
            <br /><br />
            <Link to={'/'}>Back to Home</Link>
        </div>


    );
}

export default OneTimeLink;
