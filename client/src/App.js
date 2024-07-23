import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Redirect, Route, Router, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OneTimeLink from './pages/OneTimeLink';
import { PrivateRoutes, PublicRoutes, AdminRoutes } from "./utils/common";
function App() {
  return (
    <div className="App">
       <Routes>
      
      <Route element={<PublicRoutes />}>
        <Route path='*' element={<Navigate to="/" />}/>
        <Route path="/" exact element={<Login />} />
      </Route>

      <Route element={<PrivateRoutes />}>
        <Route path='*' element={<Navigate to="/" />}/>
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/oneTimeLink/:token" element={<OneTimeLink />} />
      </Route>

      {/* <Route element={<AdminRoutes />}>
        <Route path='*' element={<Navigate to="/" />}/>
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/oneTimeLink/:token" element={<OneTimeLink />} />
      </Route> */}

    </Routes>
    </div>
  );
}

export default App;
