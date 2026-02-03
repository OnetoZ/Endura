import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

// Placeholder Components
const Home = () => (
  <div className="home-container">
    <h1>Welcome to Project ENDURA</h1>
    <p>Clean, Modern, Scalable</p>
  </div>
);

const NotFound = () => <h1>404 - Not Found</h1>;

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
