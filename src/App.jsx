import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home-page';
import LoginSignup from './Login/LoginSignup-page';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login-signup" element={<LoginSignup />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};

export default App;
