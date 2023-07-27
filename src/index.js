import React from 'react';
import App from './App.tsx';
import ReactDOM from 'react-dom/client';
import { IndexProviders } from '@/context';
import reportWebVitals from './reportWebVitals';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <IndexProviders>
    <App />
  </IndexProviders>,
);

reportWebVitals();
