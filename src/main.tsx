import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import * as tf from '@tensorflow/tfjs';

// Initialize TensorFlow.js
await tf.ready();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);