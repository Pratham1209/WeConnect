import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HelpRequest from "./pages/HelpRequest";
import VolunteerDashboard from './pages/VolunteerDashboard';
import 'animate.css';

function App() {
  return (
    <div>
      {/* ✅ ToastContainer here only once */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover
        draggable
        pauseOnFocusLoss
        toastClassName="custom-toast"
        bodyClassName="text-sm font-medium"
      />



      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/helprequest" element={<HelpRequest />} />
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
