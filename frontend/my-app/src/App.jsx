import React from "react";
import { Routes, Route } from "react-router-dom";  // import Routes and Route
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HelpRequest from "./pages/HelpRequest";
import VolunteerDashboard from './pages/VolunteerDashboard';
import 'animate.css';


function App() {
  return (
    <div>
      <Routes>  {/* Define routes inside Routes */}
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
