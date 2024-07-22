import React from "react";
import { Navigate  } from 'react-router-dom';
import { Outlet } from 'react-router';


export const PrivateRoutes = () => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    return (
        <>
            {isAuthenticated ? (<Outlet />) : (<Navigate  to='/' />)}
        </>
    )
}

export const PublicRoutes = () => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    return (
        <>
            {isAuthenticated ? (<Navigate  to='/dashboard' />) : (<Outlet />)}
        </>
    )
}
