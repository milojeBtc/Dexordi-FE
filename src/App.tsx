import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';

import { useState, createContext, useContext } from "react";
import { UserContext } from './context/loadingContext';

import Header from './Layout/Header';
import Body from './Layout/Body';
import Footer from './Layout/Footer';

import BackendTest from './component/BackendTest';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [loading, setLoading] = useState(null);

  return (
    <UserContext.Provider value={{loading, setLoading}}>
      <div className="container mx-auto">
        <Header />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            
          </Route>
          <Route path="/test" element={<BackendTest />} />
        </Routes>
      </BrowserRouter>
      <Footer />
      </div>
      <ToastContainer />
    </UserContext.Provider>
  );
}

export default App;
