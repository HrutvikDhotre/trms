import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import App from './App.jsx';
import './index.css';
import ContextProvider from './contexts/ContextProvider.jsx';
import { Router } from 'react-router-dom';



ReactDOM.createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <React.StrictMode>
      {/* <Router> */}
      <App />
      {/* </Router> */}
    </React.StrictMode>
  </ContextProvider>,
)
